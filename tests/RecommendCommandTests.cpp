//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "storage/IDataStorage.h"
#include "output/IOutputWriter.h"
#include "commands/RecommendCommand.h"

// ---- System ----
#include <gtest/gtest.h>
#include <sstream>
#include <vector>
#include <map>
#include <set>

//====================================================================================================
// 1. MOCK OBJECTS
//====================================================================================================
class FakeDataStorage : public IDataStorage
{
public:
    std::map<std::string, std::set<std::string>> fakeData;

    std::map<std::string, std::set<std::string>> loadAll() override
    {
        return fakeData;
    }
    void save(const std::string &userId, const std::vector<std::string> &products) override
    {
        // Not needed for recommendation tests
    }
};

class MockWriter : public IOutputWriter
{
public:
    std::vector<std::string> messages;
    std::string lastMessage;

    void write(const std::string &message) override
    {
        messages.push_back(message);
        lastMessage = message;
    }

    void clear()
    {
        messages.clear();
        lastMessage = "";
    }
};

//====================================================================================================
// 2. TEST FIXTURE
//====================================================================================================
class RecommendTests : public ::testing::Test
{
protected:
    FakeDataStorage fakeStorage;
    MockWriter writer;
    RecommendCommand *cmd;

    void SetUp() override
    {
        // Inject both the fake storage and the mock writer
        cmd = new RecommendCommand(fakeStorage, writer);
    }

    void TearDown() override
    {
        delete cmd;
    }
};

//====================================================================================================
// 3. UPDATED TESTS
//====================================================================================================

// Test 1: Empty Storage
TEST_F(RecommendTests, EmptyStorageReturnsEmpty)
{
    fakeStorage.fakeData = {};
    std::istringstream argsStream("1 100");

    cmd->execute(argsStream);

    // In Exercise 2, an empty recommendation should be "404 Not Found" as the request is logical but the output is nothing.
    EXPECT_EQ(writer.lastMessage, "404 Not Found");
}

// Test 2: Basic Recommendation
TEST_F(RecommendTests, BasicRecommendation)
{
    fakeStorage.fakeData = {{"1", {"100"}}, {"2", {"100", "200"}}};
    std::istringstream argsStream("1 100");
    cmd->execute(argsStream);

    // In Exercise 2, a good recommendation is "200 OK".
    EXPECT_EQ(writer.lastMessage, "200 OK");
}

// Test 3: Tie-Breaking by ID
TEST_F(RecommendTests, TieBreakingByID)
{
    fakeStorage.fakeData = {{"1", {"104"}}, {"2", {"104", "999"}}, {"3", {"104", "222"}}};
    std::istringstream argsStream("1 104");
    cmd->execute(argsStream);

    // In Exercise 2, a good recommendation is "200 OK".
    EXPECT_EQ(writer.lastMessage, "200 OK");
}

// Test 6: Target Product Paradox
TEST_F(RecommendTests, TargetProductParadox)
{
    fakeStorage.fakeData = {
        {"1", {"100"}},
        {"2", {"100", "104"}}};

    std::istringstream argsStream("1 104");
    cmd->execute(argsStream);

    // 104 is the input product; it should never be recommended.
    EXPECT_EQ(writer.lastMessage, "404 Not Found");
}


// Test 7: NoTabs
TEST_F(RecommendTests, NoTabs)
{
    fakeStorage.fakeData = {
        {"1", {"100"}},
        {"2", {"100", "104", "P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10", "P11, P13"}}};

    std::istringstream argsStream("1 104\t");
    cmd->execute(argsStream);

    // Use a stringstream to count the space-separated words in the result
    std::istringstream result(writer.lastMessage);
    std::string word;
    int count = 0;
    while (result >> word)
        count++;

    EXPECT_EQ(count, 0) << "No tabs";
    EXPECT_EQ(writer.lastMessage, "400 Bad Request);
}