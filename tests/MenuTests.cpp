//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "ui/ConsoleMenu.h"

// ---- System ----
#include <sstream>
#include <gtest/gtest.h>

//====================================================================================================
// Helpers - redirect std::cin so we can simulate user input without a real keyboard
//====================================================================================================
class MenuTest : public ::testing::Test
{
    protected:
        std::streambuf *originalCin; // This saves the input so we could use it after each test

        void SetUp() override
        {
            originalCin = std::cin.rdbuf();
        }
        void TearDown() override
        {
            // Restore cin after each test so other tests aren't affected
            std::cin.rdbuf(originalCin);
        }

        // Helper: redirects cin to read from a string instead of the keyboard
        void simulateInput(const std::string &input)
        {
            static std::istringstream fakeInput;
            fakeInput.str(input);
            fakeInput.clear();
            std::cin.rdbuf(fakeInput.rdbuf());
        }
};

//====================================================================================================
// Test 1: InvalidCommandSilence
//====================================================================================================
TEST_F(MenuTest, InvalidCommandSilence){
    simulateInput("delete 1 101\n");
    ConsoleMenu menu;

    std::string command = menu.nextCommand(); 

    // As noted, when getting an unknown command we should silently ignore it (and not crash)
    EXPECT_NO_THROW(menu.nextCommand());
}

//====================================================================================================
// Test 2: StrictWhitespaceParsing_TabBetweenCommandAndUserId
//====================================================================================================
TEST_F(MenuTest, StrictWhitespaceParsing_TabBetweenCommandAndUserId){
    simulateInput("add\t1 101\n"); // \t - sign for tab
    ConsoleMenu menu;

    std::string command = menu.nextCommand();

    // Due to the reason we have a tab, the parser should decline this input
    // std::string::npos is a constant representing "Not Found"
    EXPECT_TRUE(command.find('\t') != std::string::npos) << "Menu should return the line including the tab so th parser will reject it";
}

//====================================================================================================
// Test 3: StrictWhitespaceParsing_TabBetweenProductIds
//====================================================================================================
TEST_F(MenuTest, StrictWhitespaceParsing_TabBetweenProductIds){
    simulateInput("add 1 101\t102\n"); // \t - sign for tab
    ConsoleMenu menu;

    std::string command = menu.nextCommand();

    // Due to the reason we have a tab, the parser should decline this input
    // std::string::npos is a constant representing "Not Found"
    EXPECT_TRUE(command.find('\t') != std::string::npos) << "Menu should return the line including the tab so th parser will reject it";
}

//====================================================================================================
// Test 4: ValidCommandPassedThrough
//====================================================================================================
TEST_F(MenuTest, ValidCommandPassedThrough) {
    simulateInput("add 1 101 102\n");
    ConsoleMenu menu;

    std::string command = menu.nextCommand();

    EXPECT_EQ(command, "add 1 101 102")
        << "Menu should return the raw line exactly as the user typed it";
}