#include <gtest/gtest.h>
#include <sstream>
#include <iostream>
#include <vector>
#include <map>
#include <set>
#include "RecommendCommand.h"
#include "IDataStorage.h"

/**
 * 1. FAKE DATA STORAGE (Mock)
 * This class mimics the behavior of a real database/file storage.
 * It allows us to inject specific test cases without needing actual files.
 */
class FakeDataStorage : public IDataStorage {
public:
    std::map<std::string, std::set<std::string>> fakeData;

    std::map<std::string, std::set<std::string>> loadAll() override {
        return fakeData;
    }

    void saveAll(const std::map<std::string, std::set<std::string>>& data) {
        // Not needed for recommendation logic tests
    }
    void save(const std::string &userId, const std::vector<std::string> &products) override{
        return;
    }
};

/**
 * 2. TEST FIXTURE: RecommendTests
 * Automates the "hijacking" of std::cout so we can verify what the command prints.
 * Setup runs before each test; TearDown runs after.
 */
class RecommendTests : public ::testing::Test {
protected:
    FakeDataStorage fakeStorage;
    std::stringstream captureBuf;
    std::streambuf* originalBuf;
    RecommendCommand* cmd;

    void SetUp() override {
        // Redirect cout to our local stringstream
        originalBuf = std::cout.rdbuf();
        std::cout.rdbuf(captureBuf.rdbuf());
        cmd = new RecommendCommand(fakeStorage);
    }

    void TearDown() override {
        // Restore cout to its original state
        std::cout.rdbuf(originalBuf);
        delete cmd;
    }
};

// =========================================================================
// JIRA TASK UNIT TESTS
// =========================================================================

//Test 1 - ValidRecommendParsing
TEST_F(RecommendTests, ValidRecommendParsing) {
    fakeStorage.fakeData = {
        {"1", {"100", "101", "102", "103"}},
        {"2", {"101", "102", "104", "105", "106"}},
        {"3", {"100", "104", "105", "107", "108"}},
        {"6", {"100", "103", "104", "110", "111", "112", "113"}},
        {"8", {"101", "104", "105", "106", "109", "111", "114"}}
    };
    
    std::istringstream argsStream("1 104");
    cmd->execute(argsStream);
    
    // Expected output sorted by relevance (and ID if tie) as per PDF logic
    std::string expected = "105 106 111 110 112 113 107 108 109 114 \n";
    EXPECT_EQ(captureBuf.str(), expected);
}

//Test 2 - RecommendMissingArgs (Input is only 'userid')
TEST_F(RecommendTests, RecommendMissingArgs) {
    std::istringstream argsStream("1"); 
    cmd->execute(argsStream);
    EXPECT_EQ(captureBuf.str(), ""); // Should ignore and print nothing
}

//Test 3 - RecommendNoArgs (Empty input)
TEST_F(RecommendTests, RecommendNoArgs) {
    std::istringstream argsStream(""); 
    cmd->execute(argsStream);
    EXPECT_EQ(captureBuf.str(), "");
}

//Test 4 - Cold Start (No overlap between users)
TEST_F(RecommendTests, ColdStartNoOverlap) {
    fakeStorage.fakeData = {
        {"1", {"100"}}, 
        {"2", {"200", "104"}} 
    };
    
    std::istringstream argsStream("1 104");
    cmd->execute(argsStream);
    
    // No common items between User 1 and 2, relevance is 0
    EXPECT_EQ(captureBuf.str(), "\n"); 
}

//Test 5 - Perfect Tie (Ascending ID Rule)
TEST_F(RecommendTests, PerfectTieAscendingID) {
    fakeStorage.fakeData = {
        {"1", {"100"}},
        {"2", {"100", "104", "999"}}, 
        {"3", {"100", "104", "222"}}  
    };
    
    // Both 222 and 999 have a score of 1. 222 must be listed first.
    std::istringstream argsStream("1 104");
    cmd->execute(argsStream);
    EXPECT_EQ(captureBuf.str(), "222 999 \n");
}

//Test 6 - Target Product Paradox
TEST_F(RecommendTests, TargetProductParadox) {
    fakeStorage.fakeData = {
        {"1", {"100"}},
        {"2", {"100", "104"}} 
    };
    
    std::istringstream argsStream("1 104");
    cmd->execute(argsStream);
    
    // 104 is the input product; it should never be recommended to the user.
    EXPECT_EQ(captureBuf.str(), "\n");
}

//Test 7 - The 10-Limit Boundary
TEST_F(RecommendTests, TenLimitBoundary) {
    fakeStorage.fakeData = {
        {"1", {"100"}},
        {"2", {"100", "104", "P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10", "P11"}}
    };
    
    std::istringstream argsStream("1 104");
    cmd->execute(argsStream);
    
    // Count items in output: should be exactly 10
    std::string out = captureBuf.str();
    std::stringstream ss(out);
    std::string temp;
    int count = 0;
    while (ss >> temp) count++;
    
    EXPECT_EQ(count, 10);
}

//Test 8 - Non-Existent User/Product
TEST_F(RecommendTests, NonExistentUser) {
    fakeStorage.fakeData = {
        {"2", {"100", "104"}}
    };
    
    std::istringstream argsStream("99 104"); // User 99 does not exist
    
    // Verify that the command handles non-existent users without crashing
    EXPECT_NO_THROW(cmd->execute(argsStream));
}