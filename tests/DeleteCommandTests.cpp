//====================================================================================================
// Include all needed headers
//====================================================================================================

// ---- Files ----
#include "storage/FileDataStorage.h"
#include "commands/DeleteCommand.h"
#include "output/IOutputWriter.h"

// ---- System ----
#include <gtest/gtest.h>
#include <filesystem>
#include <sstream>
#include <vector>
#include <string>
#include <set>

// ---- Test path ----
static const std::string TEST_FILE = "data/test_storage.txt";

//====================================================================================================
// MockWriter
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
// Test Fixture
//====================================================================================================
class DeleteCommandTest : public ::testing::Test
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

    void seedUser(FileDataStorage &storage,
                  const std::string &user,
                  const std::vector<std::string> &products)
    {
        storage.save(user, products);
    }
};

//====================================================================================================
// 1. ValidDeleteExistingProducts
//====================================================================================================
TEST_F(DeleteCommandTest, ValidDeleteExistingProducts)
{
    FileDataStorage storage(TEST_FILE);
    MockWriter writer;
    DeleteCommand del(storage, writer);

    seedUser(storage, "1", {"101", "102", "103"});

    std::istringstream args("1 101 102");
    del.execute(args);

    EXPECT_EQ(writer.lastMessage, "204 No Content");

    auto data = storage.loadAll();
    EXPECT_FALSE(data["1"].count("101"));
    EXPECT_FALSE(data["1"].count("102"));
    EXPECT_TRUE(data["1"].count("103"));
}

//====================================================================================================
// 2. UserDoesNotExist
//====================================================================================================
TEST_F(DeleteCommandTest, UserDoesNotExist)
{
    FileDataStorage storage(TEST_FILE);
    MockWriter writer;
    DeleteCommand del(storage, writer);

    std::istringstream args("999 101");

    del.execute(args);

    EXPECT_EQ(writer.lastMessage, "404 Not Found");
}

//====================================================================================================
// 3. ProductDoesNotExist
//====================================================================================================
TEST_F(DeleteCommandTest, ProductDoesNotExist)
{
    FileDataStorage storage(TEST_FILE);
    MockWriter writer;
    DeleteCommand del(storage, writer);

    seedUser(storage, "1", {"101"});

    std::istringstream args("1 999");

    del.execute(args);

    EXPECT_EQ(writer.lastMessage, "404 Not Found");

    auto data = storage.loadAll();
    EXPECT_TRUE(data["1"].count("101"));
}

//====================================================================================================
// 4. PartialMissingProductFailsAtomic
//====================================================================================================
TEST_F(DeleteCommandTest, PartialMissingProductFailsAtomic)
{
    FileDataStorage storage(TEST_FILE);
    MockWriter writer;
    DeleteCommand del(storage, writer);

    seedUser(storage, "1", {"101", "102"});

    std::istringstream args("1 101 999");

    del.execute(args);

    EXPECT_EQ(writer.lastMessage, "404 Not Found");

    auto data = storage.loadAll();
    EXPECT_TRUE(data["1"].count("101"));
    EXPECT_TRUE(data["1"].count("102"));
}

//====================================================================================================
// 5. EmptyCommand
//====================================================================================================
TEST_F(DeleteCommandTest, EmptyCommand)
{
    FileDataStorage storage(TEST_FILE);
    MockWriter writer;
    DeleteCommand del(storage, writer);

    std::istringstream args("");

    del.execute(args);

    EXPECT_EQ(writer.lastMessage, "400 Bad Request");
}

//====================================================================================================
// 6. NoProductId
//====================================================================================================
TEST_F(DeleteCommandTest, NoProductId)
{
    FileDataStorage storage(TEST_FILE);
    MockWriter writer;
    DeleteCommand del(storage, writer);

    seedUser(storage, "1", {"101"});

    std::istringstream args("1");

    del.execute(args);

    EXPECT_EQ(writer.lastMessage, "400 Bad Request");
}

//====================================================================================================
// 7. MultipleSpacesBetweenArgs
//====================================================================================================
TEST_F(DeleteCommandTest, MultipleSpacesBetweenArgs)
{
    FileDataStorage storage(TEST_FILE);
    MockWriter writer;
    DeleteCommand del(storage, writer);

    seedUser(storage, "1", {"101", "102", "103"});

    std::istringstream args("1    101   102");

    del.execute(args);

    EXPECT_EQ(writer.lastMessage, "204 No Content");

    auto data = storage.loadAll();
    EXPECT_TRUE(data["1"].count("103"));
}

//====================================================================================================
// 8. RejectTabs
//====================================================================================================
TEST_F(DeleteCommandTest, RejectTabs)
{
    FileDataStorage storage(TEST_FILE);
    MockWriter writer;
    DeleteCommand del(storage, writer);

    seedUser(storage, "1", {"101", "102"});

    std::istringstream args("1\t101\t102");

    del.execute(args);

    EXPECT_EQ(writer.lastMessage, "400 Bad Request");

    auto data = storage.loadAll();
    EXPECT_TRUE(data["1"].count("101"));
    EXPECT_TRUE(data["1"].count("102"));
}

//====================================================================================================
// 9. DeletePersistsAfterRestart
//====================================================================================================
TEST_F(DeleteCommandTest, DeletePersistsAfterRestart)
{
    {
        FileDataStorage storage(TEST_FILE);
        MockWriter writer;
        DeleteCommand del(storage, writer);

        seedUser(storage, "1", {"101", "102"});

        std::istringstream args("1 101");
        del.execute(args);
    }

    FileDataStorage freshStorage(TEST_FILE);

    auto data = freshStorage.loadAll();

    EXPECT_FALSE(data["1"].count("101"));
    EXPECT_TRUE(data["1"].count("102"));
}

//====================================================================================================
// 10. DeleteLastProduct
// (option: user remains with empty set)
//====================================================================================================
TEST_F(DeleteCommandTest, DeleteLastProduct)
{
    FileDataStorage storage(TEST_FILE);
    MockWriter writer;
    DeleteCommand del(storage, writer);

    seedUser(storage, "1", {"101"});

    std::istringstream args("1 101");

    del.execute(args);

    EXPECT_EQ(writer.lastMessage, "204 No Content");

    auto data = storage.loadAll();

    EXPECT_TRUE(data.count("1") > 0);
    EXPECT_TRUE(data["1"].empty());
}

//====================================================================================================
// 11. DuplicateArgumentsIgnored
//====================================================================================================
TEST_F(DeleteCommandTest, DuplicateArgumentsIgnored)
{
    FileDataStorage storage(TEST_FILE);
    MockWriter writer;
    DeleteCommand del(storage, writer);

    seedUser(storage, "1", {"101", "102"});

    std::istringstream args("1 101 101 102");

    del.execute(args);

    EXPECT_EQ(writer.lastMessage, "204 No Content");

    auto data = storage.loadAll();

    EXPECT_TRUE(data["1"].empty());
}