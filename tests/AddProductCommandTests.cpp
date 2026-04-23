#include <gtest/gtest.h>
#include <sstream>
#include "FileDataStorage.h"
#include "AddProductCommand.h"

static const std::string TEST_FILE = "data/test_storage.txt";

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
    EXPECT_TRUE(add.getLoader().find(1,101));
}
