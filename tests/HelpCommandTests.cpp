//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "commands/HelpCommand.h"
#include "output/IOutputWriter.h"

// ---- System ----
#include <gtest/gtest.h>
#include <sstream>
#include <vector>
#include <string>

//====================================================================================================
// MockWriter: Captures output for verification
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
    ASSERT_EQ(writer.messages.size(), 3);
    EXPECT_EQ(writer.messages[0], "POST [userid] [productid1] [productid2]...");
    EXPECT_EQ(writer.messages[1], "recommend [userid] [productid]");
    EXPECT_EQ(writer.messages[2], "help");
}

//====================================================================================================
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
// Test 3: HelpWithOnlySpacesInArgs
//====================================================================================================
TEST_F(HelpCommandTest, HelpWithOnlySpacesInArgs)
{
    std::istringstream args("   ");
    MockWriter writer;
    HelpCommand help(writer);

    help.execute(args);

    // Spaces shouldn't count as "extra args", so it should print the menu
    EXPECT_EQ(writer.messages.size(), 3);
}