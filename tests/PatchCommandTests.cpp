//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "storage/FileDataStorage.h"
#include "commands/PatchCommand.h"

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
class PatchCommandTest : public ::testing::Test
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
    // Helper: seeds storage with an existing user
    // PATCH requires the user to already exist (created via POST)
    // This simulates what POST would have done
    void seedUser(FileDataStorage &storage, const std::string &userId, const std::vector<std::string> &products)
    {
        storage.save(userId, products);
    }
};

//====================================================================================================
// Test 1: ValidPatchExistingUser
// Purpose: PATCH with existing user adds new products and returns "204 No Content"
//====================================================================================================
TEST_F(PatchCommandTest, ValidPatchExistingUser)
{
    FileDataStorage storage(TEST_FILE); // The path to the file we test
    MockWriter writer;
    PatchCommand patch(storage, writer); // An instance of PatchCommand class (which replaced AddProductCommand)

    // Seed an existing user first (simulates prior POST)
    seedUser(storage, "1", {"101"});

    // Now the users exists so we add more products
    std::istringstream args("1 102 103");
    patch.execute(args);

    EXPECT_EQ(writer.lastMessage, "204 No Content") << "PATCH with existing user should return 204 No Content";

    // Both original and new prosucts should exist
    auto data = storage.loadAll();
    ASSERT_TRUE(data.count("1") > 0) << "User 1 should exist";
    EXPECT_TRUE(data["1"].count("101") > 0) << "Original product 101 should still exist";
    EXPECT_TRUE(data["1"].count("102") > 0) << "New product 102 should be added";
    EXPECT_TRUE(data["1"].count("103") > 0) << "New product 103 should be added";
}

//====================================================================================================
// Test 2: UserDoesNotExist
// Purpose: PATCH with non-existing user returns "404 Not Found" — nothing saved
//====================================================================================================
TEST_F(PatchCommandTest, UserDoesNotExist)
{
    FileDataStorage storage(TEST_FILE); // The path to the file we test
    MockWriter writer;
    PatchCommand patch(storage, writer); // An instance of PatchCommand class (which replaced AddProductCommand)

    // No seeding — user does not exist
    std::istringstream args("1 101 102");
    patch.execute(args);

    EXPECT_EQ(writer.lastMessage, "404 Not Found") << "PATCH with non-existing user should return '404 Not Found'";

    // Nothing should be saved
    auto data = storage.loadAll();
    EXPECT_TRUE(data.empty()) << "Storage should be empty — PATCH should not create users";
}

//====================================================================================================
// Test 3: NoProductID
// Purpose: PATCH with userId but no products is malformed — returns "400 Bad Request"
//====================================================================================================
TEST_F(PatchCommandTest, NoProductID)
{
    FileDataStorage storage(TEST_FILE); // The path to the file we test
    MockWriter writer;
    PatchCommand patch(storage, writer); // An instance of PatchCommand class (which replaced AddProductCommand)

    // Seed an existing user first (simulates prior POST)
    seedUser(storage, "1", {"101"});

    // PATCH with no products
    std::istringstream args("1");
    patch.execute(args);

    EXPECT_EQ(writer.lastMessage, "400 Bad Request") << "PATCH with no product ID should return '400 Bad Request'";

    // Original data must not change
    auto data = storage.loadAll();
    ASSERT_TRUE(data.count("1") > 0) << "User 1 should still exist";
    EXPECT_EQ(data["1"].size(), 1) << "User 1 should still have exactly 1 product";
}

//====================================================================================================
// Test 4: EmptyCommand
// Purpose: PATCH with no arguments at all returns "400 Bad Request"
//====================================================================================================
TEST_F(PatchCommandTest, EmptyCommand)
{
    FileDataStorage storage(TEST_FILE); // The path to the file we test
    MockWriter writer;
    PatchCommand patch(storage, writer); // An instance of PatchCommand class (which replaced AddProductCommand)

    // PATCH empty input
    std::istringstream args("");
    patch.execute(args);

    EXPECT_EQ(writer.lastMessage, "400 Bad Request") << "Empty PATCH should return '400 Bad Request'";

    // Original data must not change
    auto data = storage.loadAll();
    EXPECT_TRUE(data.empty()) << "Storage should be empty after empty PATCH";
}

//====================================================================================================
// Test 5: MultipleSpacesBetweenArgs
// Purpose: Multiple spaces between args are handled correctly
//====================================================================================================
TEST_F(PatchCommandTest, MultipleSpacesBetweenArgs)
{
    FileDataStorage storage(TEST_FILE); // The path to the file we test
    MockWriter writer;
    PatchCommand patch(storage, writer); // An instance of PatchCommand class (which replaced AddProductCommand)

    // Seed an existing user first (simulates prior POST)
    seedUser(storage, "1", {"101"});

    // Patch with valid spaces
    std::istringstream args("1    102   103");
    patch.execute(args);

    EXPECT_EQ(writer.lastMessage, "204 No Content") << "PATCH with multiple spaces should still return '204 No Content'";

    // data must be saved
    auto data = storage.loadAll();
    ASSERT_TRUE(data.count("1") > 0) << "User 1 should exist";
    EXPECT_TRUE(data["1"].count("102") > 0) << "Product 102 should be added";
    EXPECT_TRUE(data["1"].count("103") > 0) << "Product 103 should be added";
}

//====================================================================================================
// Test 6: DuplicateProductNotAddedTwice
// Purpose: PATCH with a product the user already has does not create duplicates
//====================================================================================================
TEST_F(PatchCommandTest, DuplicateProductNotAddedTwice)
{
    FileDataStorage storage(TEST_FILE); // The path to the file we test
    MockWriter writer;
    PatchCommand patch(storage, writer); // An instance of PatchCommand class (which replaced AddProductCommand)

    // Seed user with product 101
    seedUser(storage, "1", {"101"});

    // PATCH with same product 101 again
    std::istringstream args("1 101");
    patch.execute(args);

    EXPECT_EQ(writer.lastMessage, "204 No Content") << "PATCH with duplicate product should still return '204 No Content'";

    // Product 101 should appear exactly once
    auto data = storage.loadAll();
    ASSERT_TRUE(data.count("1") > 0) << "User 1 should exist";
    EXPECT_EQ(data["1"].count("101"), 1) << "Product 101 should appear exactly once";
    EXPECT_EQ(data["1"].size(), 1) << "User 1 should have exactly 1 product total";
}

//====================================================================================================
// Test 7: PatchPersistsAfterRestart
// Purpose: Products added by PATCH survive a full cold-start restart
//====================================================================================================
TEST_F(PatchCommandTest, PatchPersistsAfterRestart)
{
    // Seed user and PATCH, then destroy storage
    {
        FileDataStorage storage(TEST_FILE); // The path to the file we test
        MockWriter writer;
        PatchCommand patch(storage, writer); // An instance of PatchCommand class (which replaced AddProductCommand)

        seedUser(storage, "1", {"101"});

        std::istringstream args("1 102 103");
        patch.execute(args);
    }
    // Storage destroyed — cold restart

    // Reconstruct from file
    FileDataStorage freshStorage(TEST_FILE);
    auto data = freshStorage.loadAll();

    ASSERT_TRUE(data.count("1") > 0) << "User 1 should exist after restart";
    EXPECT_TRUE(data["1"].count("101") > 0) << "Original product 101 should persist";
    EXPECT_TRUE(data["1"].count("102") > 0) << "Patched product 102 should persist";
    EXPECT_TRUE(data["1"].count("103") > 0) << "Patched product 103 should persist";
}

//====================================================================================================
// Test 8: PatchAfterRestartStillRejectsNonExistentUser
// Purpose: After restart, PATCH for non-existing user still returns "404 Not Found"
// Verifies existence check uses persisted data not just in-memory state
//====================================================================================================
TEST_F(PatchCommandTest, PatchAfterRestartStillRejectsNonExistentUser)
{
    // Create storage and destroy without adding any users
    {
        FileDataStorage storage(TEST_FILE); // The path to the file we test
    }
    // Storage destroyed — cold restart

    FileDataStorage freshStorage(TEST_FILE); // The path to the file we test
    MockWriter freshWriter;
    PatchCommand freshPatch(freshStorage, freshWriter); // An instance of PatchCommand class (which replaced AddProductCommand)

    std::istringstream args("1 101");
    freshPatch.execute(args);

    EXPECT_EQ(freshWriter.lastMessage, "404 Not Found") << "PATCH for non-existing user should return '404 Not Found' after restart";
}