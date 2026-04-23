#include <gtest/gtest.h>
#include <AddProductCommand.h> 

TEST (AddProductTest, ValidSingleProduct){
    FileDataStorage Loader;
    AddProductCommand add (Loader);
    //Enter a user 1 the product 101.
    add.execute(); 
    Assert_True(add.getLoader.find(1,101));
}
