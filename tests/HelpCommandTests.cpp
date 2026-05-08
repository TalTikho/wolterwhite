//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "HelpCommand.h"

// ---- System ----
#include <gtest/gtest.h>
#include <sstream>

//====================================================================================================
// Fixture: captures std::cout so we can verify exact output
//====================================================================================================
class HelpCommandTest : public ::testing::Test {
protected:
    std::ostringstream captured;
    std::streambuf* originalCout;

    void SetUp() override {
        // Redirect cout to our captured buffer before each test
        originalCout = std::cout.rdbuf(captured.rdbuf());
    }

    void TearDown() override {
        // Always restore cout after each test so other tests aren't affected
        std::cout.rdbuf(originalCout);
    }
};

//====================================================================================================
// Test 1: HelpExactOutput
// Purpose: Verify the three lines are printed exactly as the assignment specifies
//====================================================================================================
TEST_F(HelpCommandTest, HelpExactOutput) {
    std::istringstream args("");
    HelpCommand help;
    help.execute(args);

    // Build the exact expected string
    std::string expected =
        "add [userid] [productid1] [productid2]...\n"
        "recommend [userid] [productid]\n"
        "help\n";

    EXPECT_EQ(captured.str(), expected)
        << "Help output must match the assignment spec exactly";
}

//====================================================================================================
// Test 2: HelpExactSpacing
// Purpose: Verify exactly one space between words, no extra spaces anywhere
//====================================================================================================
TEST_F(HelpCommandTest, HelpExactSpacing) {
    std::istringstream args("");
    HelpCommand help;
    help.execute(args);

    std::string output = captured.str();

    // Each line must appear exactly once with correct spacing
    EXPECT_TRUE(output.find("add [userid] [productid1] [productid2]...") 
        != std::string::npos)
        << "First line must have exact spacing";

    EXPECT_TRUE(output.find("recommend [userid] [productid]") 
        != std::string::npos)
        << "Second line must have exact spacing";

    EXPECT_TRUE(output.find("help") 
        != std::string::npos)
        << "Third line must be exactly 'help'";

    // Verify no double spaces anywhere in the output
    EXPECT_TRUE(output.find("  ") == std::string::npos)
        << "Output should not contain any double spaces";
}

//====================================================================================================
// Test 3: HelpWithExtraArgs
// Purpose: "help dsh" or "help anything" should print nothing — invalid command
// This tests the extra args check in HelpCommand::execute()
//====================================================================================================
TEST_F(HelpCommandTest, HelpWithExtraArgs) {
    std::istringstream args("dsh");
    HelpCommand help;
    help.execute(args);

    // Nothing should be printed
    EXPECT_TRUE(captured.str().empty())
        << "Help with extra arguments should produce no output";
}

//====================================================================================================
// Test 4: HelpWithMultipleExtraArgs
// Purpose: "help foo bar baz" should also print nothing
//====================================================================================================
TEST_F(HelpCommandTest, HelpWithMultipleExtraArgs) {
    std::istringstream args("foo bar baz");
    HelpCommand help;
    help.execute(args);

    EXPECT_TRUE(captured.str().empty())
        << "Help with multiple extra arguments should produce no output";
}

//====================================================================================================
// Test 5: HelpOutputEndsWithNewline
// Purpose: Each line must end with exactly one newline — no missing or extra newlines
//====================================================================================================
TEST_F(HelpCommandTest, HelpOutputEndsWithNewline) {
    std::istringstream args("");
    HelpCommand help;
    help.execute(args);

    std::string output = captured.str();

    // Output must end with exactly one newline
    EXPECT_FALSE(output.empty())
        << "Output should not be empty";

    EXPECT_EQ(output.back(), '\n')
        << "Output must end with a newline";

    // Count total newlines — must be exactly 3 (one per line)
    int newlineCount = 0;
    for (char c : output) {
        if (c == '\n') newlineCount++;
    }
    EXPECT_EQ(newlineCount, 3)
        << "Output must contain exactly 3 newlines — one per line";
}

//====================================================================================================
// Test 6: HelpWithOnlySpacesInArgs
// Purpose: "help   " (spaces only) should still print the help menu
// Spaces are not extra arguments — the stream will be empty after >> skips them
//====================================================================================================
TEST_F(HelpCommandTest, HelpWithOnlySpacesInArgs) {
    std::istringstream args("   ");
    HelpCommand help;
    help.execute(args);

    // Spaces only → args >> extra fails → help menu should print
    EXPECT_FALSE(captured.str().empty())
        << "Help with only spaces in args should still print the help menu";
}