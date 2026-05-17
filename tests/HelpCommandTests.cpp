
//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "commands/HelpCommand.h"
#include "output/IOutputWriter.h"
#include "output/IOutputWriter.h"

// ---- System ----
#include <gtest/gtest.h>
#include <sstream>
#include <vector>
#include <string>
#include <vector>
#include <string>

//====================================================================================================
// MockWriter: Captures output for verification
// MockWriter: Captures output for verification
//====================================================================================================
class MockWriter : public IOutputWriter
{
public:
    std::vector<std::string> messages;
    std::string lastMessage;
class MockWriter : public IOutputWriter
{
public:
    std::vector<std::string> messages;
    std::string lastMessage;

    void write(const std::string &message) override
    {
        messages.push_back(message);
        lastMessage = message;
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

class HelpCommandTest : public ::testing::Test
{
protected:
    // No longer need to redirect std::cout buffers!
};





//====================================================================================================
// Test 1: HelpExactOutput
//====================================================================================================
TEST_F(HelpCommandTest, HelpExactOutput)
{
    std::istringstream args("");
    MockWriter writer;
    HelpCommand help(writer); // Constructor injection

    help.execute(args);

    // The assignment requires these 3 lines
    ASSERT_EQ(writer.messages.size(), 5);
    EXPECT_EQ(writer.messages[0], "DELETE, arguments: [userid] [productid1] [productid2] ...");
    EXPECT_EQ(writer.messages[1], "GET, arguments: [userid] [productid]");
    EXPECT_EQ(writer.messages[2], "PATCH, arguments: [userid] [productid1] [productid2] ...");
    EXPECT_EQ(writer.messages[3], "POST, arguments: [userid] [productid1] [productid2] ...");
    EXPECT_EQ(writer.messages[4], "help");

    EXPECT_EQ(captured.str(), expected)
        << "Help output must match the assignment spec exactly";
}


//====================================================================================================
// Test 2: HelpWithExtraArgsPrintsNothing
// Test 2: HelpWithExtraArgsPrintsNothing
//====================================================================================================
TEST_F(HelpCommandTest, HelpWithExtraArgsPrintsNothing)
{
    std::istringstream args("extra_junk");
    MockWriter writer;
    HelpCommand help(writer);

    help.execute(args);

    // If extra args are present, it should print nothing (size 0)
    EXPECT_TRUE(writer.messages.empty());
}

//====================================================================================================
// Test 3: HelpWithMultipleExtraArgs
// Purpose: "help foo bar baz" should also print nothing
//====================================================================================================
TEST_F(HelpCommandTest, HelpWithMultipleExtraArgs) {
    std::istringstream args("foo bar baz");
    MockWriter writer;
    HelpCommand help(writer);

    help.execute(args);

    // If extra args are present, it should print nothing (size 0)
    EXPECT_TRUE(writer.messages.empty());
    // If extra args are present, it should print nothing (size 0)
    EXPECT_TRUE(writer.messages.empty());
}


//====================================================================================================
// Test 4: HelpWithOnlySpacesInArgs
//====================================================================================================
TEST_F(HelpCommandTest, HelpWithOnlySpacesInArgs)
{
    std::istringstream args("   ");
    MockWriter writer;
    HelpCommand help(writer);

    help.execute(args);

    // Spaces shouldn't count as "extra args", so it should print the menu
    EXPECT_EQ(writer.messages.size(), 5);
}

//====================================================================================================
// Test 5: NoTabs
//====================================================================================================
TEST_F(HelpCommandTest, HelpNoTabs)
{
    std::istringstream args("   \t");
    MockWriter writer;
    HelpCommand help(writer);

    help.execute(args);

    //Tabsare not allowed
    EXPECT_EQ(writer.messages.size(), 0);
}

