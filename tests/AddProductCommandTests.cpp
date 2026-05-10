#include <gtest/gtest.h>
#include <sstream>
#include <filesystem>
#include "storage/FileDataStorage.h"
#include "commands/AddProductCommand.h"

static const std::string TEST_FILE = "data/test_storage.txt";

//====================================================================================================
// Fixture: handles cleanup before and after every test automatically
// Replaces the manual std::remove() calls at the end of each test
//====================================================================================================
class AddProductTest : public ::testing::Test {
protected:
    void SetUp() override {
        std::filesystem::remove(TEST_FILE);
    }
    void TearDown() override {
        std::filesystem::remove(TEST_FILE);
    }
};

//====================================================================================================
// Test 1: ValidSingleProduct
// Tests single product save + second execute on same user accumulates
//====================================================================================================
TEST_F(AddProductTest, ValidSingleProduct) {
    std::string args = "1 101";
    std::istringstream argsStream(args);

    FileDataStorage loader(TEST_FILE);
    AddProductCommand add(loader);
    add.execute(argsStream);

    auto data = loader.loadAll();

    // Check if User "1" exists in the database
    ASSERT_TRUE(data.count("1") > 0) << "Failure: User 1 was not found in storage.";

    // Check if Product "101" is in User "1"'s set of products
    EXPECT_TRUE(data["1"].count("101") > 0) << "Failure: Product 101 not found for User 1.";

    // Second execute — same user, new product
    args = "1 102";
    std::istringstream argsStream2(args);
    add.execute(argsStream2);

    auto data2 = loader.loadAll();

    // Check if User "1" still exists
    ASSERT_TRUE(data2.count("1") > 0) << "Failure: User 1 was not found in storage.";

    // Check if Product "102" is now also stored
    EXPECT_TRUE(data2["1"].count("102") > 0) << "Failure: Product 102 not found for User 1.";
}

//====================================================================================================
// Test 2: ValidMultipleProducts
// Tests multiple products in a single execute call
//====================================================================================================
TEST_F(AddProductTest, ValidMultipleProducts) {
    std::string args = "1 101 102 103";
    std::istringstream argsStream(args);

    FileDataStorage loader(TEST_FILE);
    AddProductCommand add(loader);
    add.execute(argsStream);

    auto data = loader.loadAll();

    // Check if User "1" exists
    ASSERT_TRUE(data.count("1") > 0) << "Failure: User 1 was not found in storage.";

    // Check all three products are stored
    EXPECT_TRUE(data["1"].count("101") > 0) << "Failure: Product 101 not found for User 1.";
    EXPECT_TRUE(data["1"].count("102") > 0) << "Failure: Product 102 not found for User 1.";
    EXPECT_TRUE(data["1"].count("103") > 0) << "Failure: Product 103 not found for User 1.";
}

//====================================================================================================
// Test 3: MultipleSpacesBetweenArgs
// Tests that >> handles multiple spaces between tokens automatically
//====================================================================================================
TEST_F(AddProductTest, MultipleSpacesBetweenArgs) {
    std::string args = "1    101 102   103";
    std::istringstream argsStream(args);

    FileDataStorage loader(TEST_FILE);
    AddProductCommand add(loader);
    add.execute(argsStream);

    auto data = loader.loadAll();

    // Check if User "1" exists
    ASSERT_TRUE(data.count("1") > 0) << "Failure: User 1 was not found in storage.";

    // Check all three products are stored despite extra spaces
    EXPECT_TRUE(data["1"].count("101") > 0) << "Failure: Product 101 not found for User 1.";
    EXPECT_TRUE(data["1"].count("102") > 0) << "Failure: Product 102 not found for User 1.";
    EXPECT_TRUE(data["1"].count("103") > 0) << "Failure: Product 103 not found for User 1.";
}

//====================================================================================================
// Test 4: NoProductID
// Tests that a userId with no products is silently ignored
//====================================================================================================
TEST_F(AddProductTest, NoProductID) {
    std::string args = "1";
    std::istringstream argsStream(args);

    FileDataStorage loader(TEST_FILE);
    AddProductCommand add(loader);
    add.execute(argsStream);

    auto data = loader.loadAll();

    // User "1" should NOT exist — no products means nothing was saved
    ASSERT_FALSE(data.count("1") > 0) << "Failure: User 1 was found in storage but should not be.";
}

//====================================================================================================
// Test 5: AddEmptyCommand
// Tests that an empty input is silently ignored
//====================================================================================================
TEST_F(AddProductTest, AddEmptyCommand) {
    std::string args = "";
    std::istringstream argsStream(args);

    FileDataStorage loader(TEST_FILE);
    AddProductCommand add(loader);
    add.execute(argsStream);

    auto data = loader.loadAll();

    // Nothing should be stored
    ASSERT_TRUE(data.empty()) << "Failure: data should be empty for empty input.";
}

//====================================================================================================
// Test 6: StringProductIDs
// Since everything is now strings, "gibberish" is a valid product ID
// and "wrong input" means userId="wrong", productId="input" — both saved
//====================================================================================================
TEST_F(AddProductTest, StringProductIDs) {
    // "gibberish" is now a valid product ID — should be saved
    std::string args = "1 101 gibberish";
    std::istringstream argsStream(args);

    FileDataStorage loader(TEST_FILE);
    AddProductCommand add(loader);
    add.execute(argsStream);

    auto data = loader.loadAll();

    // User "1" should exist
    ASSERT_TRUE(data.count("1") > 0) << "Failure: User 1 was not found in storage.";

    // Both "101" and "gibberish" should be stored as valid string product IDs
    EXPECT_TRUE(data["1"].count("101") > 0) << "Failure: Product 101 not found for User 1.";
    EXPECT_TRUE(data["1"].count("gibberish") > 0) << "Failure: Product gibberish not found for User 1.";

    // "wrong input" → userId="wrong", productId="input" — both valid strings
    args = "wrong input";
    std::istringstream argsStream2(args);
    add.execute(argsStream2);

    auto data2 = loader.loadAll();

    // User "wrong" should now exist with product "input"
    ASSERT_TRUE(data2.count("wrong") > 0) << "Failure: User 'wrong' was not found in storage.";
    EXPECT_TRUE(data2["wrong"].count("input") > 0) << "Failure: Product 'input' not found for User 'wrong'.";
}