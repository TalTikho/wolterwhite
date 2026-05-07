#include <gtest/gtest.h>
#include <sstream>
#include "FileDataStorage.h"
#include "HelpCommand.h"

//Tests 1 and 2 from Jira both fit this test.
TEST (HelpTests, shouldWork){
    //help is the right input.
    std:: string  args = "help";
    //set the stream var for help.
    std:: istringstream argsStream(args);
    //Capture cout buffer to use in the test.
    std:: stringstream captureBuf;
    //Keep the original buffer to restore it for the next test.
    std:: streambuf* originalBuf = std:: cout:: rd.buf();
    //Capture.
    std:: cout:: rdbuf(captureBuf.rdbuf());
    HelpCommand h;
    h.execute(argsStream);
    //return the buffer after execution.
    std::cout::rdbuf(originalBuf);
    //Make sure the command was succesful.
    ASSERT_EQ(captureBuf.str(), " add [userid] [productid1] [productid2]…\nrecommend [userid] [productid]\nhelp\n");
}

//Added a test to ignore wrong input.

TEST (HelpTests, shouldIgnore){
    //help is the right input.
    std:: string  args = "help me I need somebody HELP!";
    //set the stream var for help.
    std:: istringstream argsStream(args);
    //Capture cout buffer to use in the test.
    std:: stringstream captureBuf;
    //Keep the original buffer to restore it for the next test.
    std:: streambuf* originalBuf = std:: cout:: rd.buf();
    //Capture.
    std:: cout:: rdbuf(captureBuf.rdbuf());
    HelpCommand h;
    h.execute(argsStream);
    //return the buffer after execution.
    std::cout::rdbuf(originalBuf);
    //Make sure the command was not sucessful but we can call it again later.
    ASSERT_NE(captureBuf.str(), " add [userid] [productid1] [productid2] …\nrecommend [userid] [productid]\nhelp\n");
    h.execute(argsStream);
}