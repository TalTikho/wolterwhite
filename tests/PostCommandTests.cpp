//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "storage/FileDataStorage.h"
#include "commands/PostCommand.h"

// ---- System ----
#include <gtest/gtest.h>
#include <filesystem>
#include <sstream>

// ---- SPath ----
static const std::string TEST_FILE = "data/test_storage.txt";

//====================================================================================================
// MockWriter: Captures the last message written
// Lets us verify what the command sent without needing a real socket or console
//====================================================================================================
// class MockWriter : public IOutputWriter
// {
// public:
//     std::string lastMessage;

//     void write(const std::string &message) override
//     {
//         lastMessage = message;
//     }
// };
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
// Cleaning the test file before and after every test
//====================================================================================================
class PostCommandTest : public ::testing::Test
{
protected:
    void SetUp() override
    {
        std::filesystem::remove(TEST_FILE);
    }
    void TearDown() override
    {
        std::filesystem::remove(TEST_FILE);
    }
};

//====================================================================================================
// Test 1: ValidNewUser
// Purpose: POST with a new user saves data and returns "201 created"
//====================================================================================================
TEST_F(PostCommandTest, ValidNewuser)
{
    FileDataStorage storage(TEST_FILE); // The path to the file we test
    MockWriter writer;
    PostCommand post(storage, writer); // An instance of PostCommand class (which replaced AddProductCommand)

    std::istringstream args("1 101 102");
    post.execute(args); // Catching the response of execute

    // Response should be exactly "201 Created"
    EXPECT_EQ(writer.lastMessage, "201 Created") << "POST  with new user should return '201 Created'";

    // Data should be saved as well
    auto data = storage.loadAll();
    ASSERT_TRUE(data.count("1") > 0) << "User 1 should exist after POST";
    EXPECT_TRUE(data["1"].count("101") > 0) << "Product 101 should be saved";
    EXPECT_TRUE(data["1"].count("102") > 0) << "Product 102 should be saved";
}
//====================================================================================================
// Test 2: UserAlreadyExists
// Purpose: POST with an existing user returns "404 Not Found" and does NOT overwrite data
//====================================================================================================
TEST_F(PostCommandTest, UserAlreadyExists)
{
    // Setup
    {
        FileDataStorage storage(TEST_FILE);
        MockWriter writer;
        PostCommand post(storage, writer);
        std::istringstream args("1 101");
        post.execute(args);
    }

    // Second POST - Same user so should be rejected
    FileDataStorage storage(TEST_FILE);
    MockWriter writer;
    PostCommand post(storage, writer);

    std::istringstream args("1 102");
    post.execute(args);

    // Data should not save the second POST
    EXPECT_EQ(writer.lastMessage, "404 Not Found");
}
//====================================================================================================
// Test 3: NoProductID
// Purpose: POST with userId but no products is invalid — returns "400 Bad Request"
//====================================================================================================
TEST_F(PostCommandTest, NoProductID)
{
    FileDataStorage storage(TEST_FILE); // The path to the file we test
    MockWriter writer;
    PostCommand post(storage, writer); // An instance of PostCommand class (which replaced AddProductCommand)

    std::istringstream args("1");
    post.execute(args); // Catching the response of execute

    EXPECT_EQ(writer.lastMessage, "400 Bad Request") << "POST with no product ID should return '400 Bad Request'";

    // Nothing should be saved
    auto data = storage.loadAll();
    EXPECT_TRUE(data.empty()) << "Storage should be empty after invalid POST";
}

//====================================================================================================
// Test 4: EmptyCommand
// Purpose: POST with no arguments at all returns "400 Bad Request"
//====================================================================================================
TEST_F(PostCommandTest, EmptyCommand)
{
    FileDataStorage storage(TEST_FILE); // The path to the file we test
    MockWriter writer;
    PostCommand post(storage, writer); // An instance of PostCommand class (which replaced AddProductCommand)

    std::istringstream args("");
    post.execute(args); // Catching the response of execute

    EXPECT_EQ(writer.lastMessage, "400 Bad Request") << "Empty POST should return '400 Bad Request'";

    // Nothing should be saved
    auto data = storage.loadAll();
    EXPECT_TRUE(data.empty()) << "Storage should be empty after empty POST";
}
//====================================================================================================
// Test 5: MultipleSpacesBetweenArgs
// Purpose: Multiple spaces between args are handled correctly
//====================================================================================================
TEST_F(PostCommandTest, MultipleSpacesBetweenArgs)
{
    FileDataStorage storage(TEST_FILE); // The path to the file we test
    MockWriter writer;
    PostCommand post(storage, writer); // An instance of PostCommand class (which replaced AddProductCommand)

    std::istringstream args("1    101   102");
    post.execute(args); // Catching the response of execute

    EXPECT_EQ(writer.lastMessage, "201 Created") << "POST with multiple spaces should still return '201 Created'";

    auto data = storage.loadAll();
    ASSERT_TRUE(data.count("1") > 0) << "User 1 should exist";
    EXPECT_TRUE(data["1"].count("101") > 0) << "Product 101 should be saved";
    EXPECT_TRUE(data["1"].count("102") > 0) << "Product 102 should be saved";
}
//====================================================================================================
// Test 6: DataPersistsAfterRestart
// Purpose: Data saved by POST survives a full cold-start restart
//====================================================================================================
TEST_F(PostCommandTest, DataPersistsAfterRestart)
{
    // POST and destroy storage — simulates program restart
    {
        FileDataStorage storage(TEST_FILE); // The path to the file we test
        MockWriter writer;
        PostCommand post(storage, writer); // An instance of PostCommand class (which replaced AddProductCommand)

        std::istringstream args("1 101 102");
        post.execute(args); // Catching the response of execute
    }
    // Storage destroyed — cold restart

    // Reconstruct from file
    FileDataStorage freshStorage(TEST_FILE); // The path to the file we test

    auto data = freshStorage.loadAll();
    ASSERT_TRUE(data.count("1") > 0) << "User 1 should exist after restart";
    EXPECT_TRUE(data["1"].count("101") > 0) << "Product 101 should persist";
    EXPECT_TRUE(data["1"].count("102") > 0) << "Product 102 should persist";
}
//====================================================================================================
// Test 7: SecondPostAfterRestartStillRejected
// Purpose: After restart, POST for existing user still returns "404 Not Found"
// This verifies the existence check uses persisted data, not just in-memory state
//====================================================================================================
TEST_F(PostCommandTest, SecondPostAfterRestartStillRejected)
{
    // First POST — save user 1
    {
        FileDataStorage storage(TEST_FILE); // The path to the file we test
        MockWriter writer;
        PostCommand post(storage, writer); // An instance of PostCommand class (which replaced AddProductCommand)

        std::istringstream args("1 101");
        post.execute(args); // Catching the response of execute
    }
    // Storage destroyed — cold restart

    // Reconstruct and try POST again for same user
    FileDataStorage freshStorage(TEST_FILE); // The path to the file we test
    MockWriter freshWriter;
    PostCommand freshPost(freshStorage, freshWriter); // An instance of PostCommand class (which replaced AddProductCommand)

    std::istringstream args2("1 102");
    freshPost.execute(args2); // Catching the response of execute

    EXPECT_EQ(freshWriter.lastMessage, "404 Not Found") << "POST for existing user should still return '404 Not Found' after restart";
}
//====================================================================================================
// Test 8: PostRejectInputWithTabs
// Purpose: Tabs between variables are handled correctly
//====================================================================================================
TEST_F(PostCommandTest, PostRejectInputWithTabs)
{
    FileDataStorage storage(TEST_FILE); // The path to the file we test
    MockWriter writer;
    PostCommand post(storage, writer); // An instance of PostCommand class (which replaced AddProductCommand)

    std::istringstream args("1\t102\t103");
    post.execute(args);

    EXPECT_EQ(writer.lastMessage, "400 Bad Request"); // tabs are invalid

    // Data should remain as before
    auto data = storage.loadAll();
    EXPECT_EQ(data["1"].size(), 1);           // only original 101 remains
    EXPECT_FALSE(data["1"].count("102") > 0); // 102 NOT saved
    EXPECT_FALSE(data["1"].count("103") > 0); // 103 NOT saved
}