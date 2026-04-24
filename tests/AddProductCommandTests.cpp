#include <gtest/gtest.h>
#include <sstream>
#include "FileDataStorage.h"
#include "AddProductCommand.h"

static const std::string TEST_FILE = "data/test_storage.txt";

//Test 1 + 6: ValidSingleProduct

TEST (AddProductTest, ValidSingleProduct){
    //Set user input for parsing into command and args.
    std:: string  args = "1 101";
    std:: istringstream argsStream(args);
    //Load the file into the command object.
    FileDataStorage loader(TEST_FILE);
    AddProductCommand add(loader);
    //Execute accordingly on user input.
    add.execute(argsStream); 
    //Make sure the command was succesful.

    auto data = loader.loadall();
    // Check if User 1 exists in the database
    // .count() returns 1 if found, 0 if not
    ASSERT_TRUE(data.count(1) > 0) << "Failure: User 1 was not found in storage.";

    // Check if Product 101 is in User 1's set of products
    EXPECT_TRUE(data[1].count(101) > 0) << "Failure: Product 101 not found for User 1.";

    args = "1 102";
    argsStream(args);
    add.execute(argsStream); 
    //Make sure the command was succesful.
    auto data2 = loader.loadall();
    
    // Check if User 1 still exists in the database
    // .count() returns 1 if found, 0 if not
    ASSERT_TRUE(data2.count(1) > 0) << "Failure: User 1 was not found in storage.";

    // Check if Product 102 is in User 1's set of products
    EXPECT_TRUE(data2[1].count(102) > 0) << "Failure: Product 101 not found for User 1.";


    // 5. Cleanup: Delete the test file so the next test starts with a clean slate
    std::remove(TEST_FILE.c_str());
}

//Test 2: ValidMultipleProducts

TEST (AddProductTest, ValidMultipleProducts){
    //Set user input for parsing into command and args.
    std:: string  args = "1 101 102 103";
    std:: istringstream argsStream(args);
    //Load the file into the command object.
    FileDataStorage loader(TEST_FILE);
    AddProductCommand add(loader);
    //Execute accordingly on user input.
    add.execute(argsStream); 
    //Make sure the command was succesful.
    auto data = loader.loadall();
    // Check if User 1 exists in the database
    // .count() returns 1 if found, 0 if not
    ASSERT_TRUE(data.count(1) > 0) << "Failure: User 1 was not found in storage.";

    // Check if Products 101, 102 and 103 are is in User 1's set of products
    EXPECT_TRUE(data[1].count(101) > 0) << "Failure: Product 101 not found for User 1.";
    EXPECT_TRUE(data[1].count(102) > 0) << "Failure: Product 101 not found for User 1.";
    EXPECT_TRUE(data[1].count(103) > 0) << "Failure: Product 101 not found for User 1.";

    // 5. Cleanup: Delete the test file so the next test starts with a clean slate
    std::remove(TEST_FILE.c_str());
}

//Test 3: MultipleSpacesBetweenArgs

TEST (AddProductTest, MultipleSpacesBetweenArgs){
    //Set user input for parsing into command and args.
    std:: string  args = "1    101 102   103";
    std:: istringstream argsStream(args);
    //Load the file into the command object.
    FileDataStorage loader(TEST_FILE);
    AddProductCommand add(loader);
    //Execute accordingly on user input.
    add.execute(argsStream); 
    //Make sure the command was succesful.
    auto data = loader.loadall();
    // Check if User 1 exists in the database
    // .count() returns 1 if found, 0 if not
    ASSERT_TRUE(data.count(1) > 0) << "Failure: User 1 was not found in storage.";

    // Check if Products 101, 102 and 103 are is in User 1's set of products
    EXPECT_TRUE(data[1].count(101) > 0) << "Failure: Product 101 not found for User 1.";
    EXPECT_TRUE(data[1].count(102) > 0) << "Failure: Product 101 not found for User 1.";
    EXPECT_TRUE(data[1].count(103) > 0) << "Failure: Product 101 not found for User 1.";

    // 5. Cleanup: Delete the test file so the next test starts with a clean slate
    std::remove(TEST_FILE.c_str());
}


//Test 4: NoProductID

TEST (AddProductTest, NoProductID){
    //Set user input for parsing into command and args.
    std:: string  args = "1";
    std:: istringstream argsStream(args);
    //Load the file into the command object.
    FileDataStorage loader(TEST_FILE);
    AddProductCommand add(loader);
    //Execute accordingly on user input.
    add.execute(argsStream); 
    //Make sure the command was succesful.
    auto data = loader.loadall();
    // Check if User 1 exists in the database
    // .count() returns 1 if found, 0 if not
    // If False is returns all is good. It means addProduct did not crash while not doing anything with the missing input.
    ASSERT_False(data.count(1) > 0) << "Failure: User 1 was not found in storage.";

    // 5. Cleanup: Delete the test file so the next test starts with a clean slate
    std::remove(TEST_FILE.c_str());
}



//Test 5: AddEmptyCommand

TEST (AddProductTest, AddEmptyCommand){
    //Set user input for parsing into command and args.
    std:: string  args = "";
    std:: istringstream argsStream(args);
    //Load the file into the command object.
    FileDataStorage loader(TEST_FILE);
    AddProductCommand add(loader);
    //Execute accordingly on user input.
    add.execute(argsStream); 
    //Make sure the command was succesful.
    auto data = loader.loadall();
    // Check if User 1 exists in the database
    // .count() returns 1 if found, 0 if not
    // If False is returns all is good. It means addProduct did not crash while not doing anything with the missing input.
    ASSERT_False(data.count(1) > 0) << "Failure: User 1 was not found in storage.";

    // 5. Cleanup: Delete the test file so the next test starts with a clean slate
    std::remove(TEST_FILE.c_str());
}

