// All needed #include
#include <fstream>
#include <filesystem>
#include <gtest/gtest.h>
#include <FileDataStorage.h> // The class we tests here

//====================================================================================================
// Helpers - text file of the tests and a class that will handle its creation/deletion
//====================================================================================================

static const std::string TEST_FILE = "data/test_storage.txt";

// Removes the test file before/after each test so tests don't bleed into each other
class StorageTest: public ::testing::Test{
    protected:
        void SetUp() override {
            std::filesystem::remove(TEST_FILE);
        }
        void TearDown() override {
            std::filesystem::remove(TEST_FILE); 
        }

};

//====================================================================================================
// Test 1: PersistenceRoundTrip
//====================================================================================================

TEST_F(StorageTest, PersistenceRoundTrip) {
    // Inner block simulates a creation
    {
        FileDataStorage storage(TEST_FILE); // Creates a storage object pointing at the test file
        storage.save(5, {201}); // Saves user 5  with product 201
    }
    // Storage object is now destroyed (out of scope) — simulates cold restart

    // Reconstruct from scratch, like a real program restart
    FileDataStorage freshStorage(TEST_FILE);
    auto data = freshStorage.loadAll();

    // Asserts: user 5 still has product 201
    ASSERT_TRUE(data.count(5) > 0) << "User 5 should exist after reload";
    EXPECT_TRUE(data.at(5).count(201) > 0) << "Product 201 should exist for user 5";
}

//====================================================================================================
// Test 2: MultipleAddAccumulation
//====================================================================================================

TEST_F(StorageTest, MultipleAddAccumulation) {
    // Creates a storage object
    FileDataStorage storage(TEST_FILE);

    // Two separate save calls for the same user
    storage.save(1, {101});
    storage.save(1, {102});

    auto data = storage.loadAll();

    // Asserts: user 1 has both products, not just the last one
    ASSERT_TRUE(data.count(1) > 0) << "User 1 should exist";
    EXPECT_TRUE(data.at(1).count(101) > 0) << "Product 101 should exist";
    EXPECT_TRUE(data.at(1).count(102) > 0) << "Product 102 should exist";
}

//====================================================================================================
// Test 3: FileCreatedInDataDir
//====================================================================================================

TEST_F(StorageTest, FileCreatedInDataDir) {
    // Creates a storage object and saves the data
    FileDataStorage storage(TEST_FILE);
    storage.save(1, {100});

    // Asserts: the file physically exists on disk in data/
    EXPECT_TRUE(std::filesystem::exists(TEST_FILE))
        << "Storage file should be created in data/ after first save";
}

//====================================================================================================
// Test 4: EmptySystemNoCrash
//====================================================================================================

TEST_F(StorageTest, EmptySystemNoCrash) {
    // Removing to make sure no file exists at all
    std::filesystem::remove(TEST_FILE);

    //Asserts: constructing and loading should not crash
    EXPECT_NO_THROW({
        FileDataStorage storage(TEST_FILE);
        auto data = storage.loadAll();
        EXPECT_TRUE(data.empty()) << "Data should be empty when no file exists";
    });
}
   