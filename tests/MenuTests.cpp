//====================================================================================================
// Include all needed headers
//====================================================================================================

// ---- Files ----
#include "ui/ConsoleMenu.h"

// ---- System ----
#include <sstream>
#include <gtest/gtest.h>
#include <string>

//====================================================================================================
// Helpers - redirect std::cin so we can simulate user input without a real keyboard
//====================================================================================================
class MenuTest : public ::testing::Test
{
protected:
    std::streambuf *originalCin;

    void SetUp() override
    {
        originalCin = std::cin.rdbuf();
    }

    void TearDown() override
    {
        std::cin.rdbuf(originalCin);
    }

    void simulateInput(const std::string &input)
    {
        static std::istringstream fakeInput;
        fakeInput.str(input);
        fakeInput.clear();
        std::cin.rdbuf(fakeInput.rdbuf());
    }
};

//====================================================================================================
// Test 1: UnknownCommandIsStillReturned (Menu does NOT filter commands)
//====================================================================================================
TEST_F(MenuTest, UnknownCommandIsStillReturned)
{
    simulateInput("banana 1 101\n");

    ConsoleMenu menu;

    std::string command = menu.nextCommand();

    EXPECT_EQ(command, "banana 1 101")
        << "Menu should return raw input without validation";
}

//====================================================================================================
// Test 2: TabsBetweenCommandAndArgsArePreserved
//====================================================================================================
TEST_F(MenuTest, TabsBetweenCommandAndArgsArePreserved)
{
    simulateInput("POST\t1 101\n");

    ConsoleMenu menu;

    std::string command = menu.nextCommand();

    EXPECT_NE(command.find('\t'), std::string::npos)
        << "Tab must be preserved for server validation";
}

//====================================================================================================
// Test 3: TabsBetweenArgumentsArePreserved
//====================================================================================================
TEST_F(MenuTest, TabsBetweenArgumentsArePreserved)
{
    simulateInput("POST 1 101\t102\n");

    ConsoleMenu menu;

    std::string command = menu.nextCommand();

    EXPECT_NE(command.find('\t'), std::string::npos)
        << "Tab between arguments must be preserved";
}

//====================================================================================================
// Test 4: ValidCommandIsReturnedExactlyAsTyped
//====================================================================================================
TEST_F(MenuTest, ValidCommandIsReturnedExactlyAsTyped)
{
    simulateInput("POST 1 101 102\n");

    ConsoleMenu menu;

    std::string command = menu.nextCommand();

    EXPECT_EQ(command, "POST 1 101 102")
        << "Menu must return exact raw input without modification";
}

//====================================================================================================
// Test 5: EmptyInputReturnsEmptyString
//====================================================================================================
TEST_F(MenuTest, EmptyInputReturnsEmptyString)
{
    simulateInput("\n");

    ConsoleMenu menu;

    std::string command = menu.nextCommand();

    EXPECT_TRUE(command.empty())
        << "Empty input should return empty string";
}

//====================================================================================================
// Test 6: OnlySpacesAreReturnedAsIs
//====================================================================================================
TEST_F(MenuTest, OnlySpacesAreReturnedAsIs)
{
    simulateInput("   \n");

    ConsoleMenu menu;

    std::string command = menu.nextCommand();

    EXPECT_EQ(command, "   ")
        << "Spaces should be preserved exactly";
}

//====================================================================================================
// Test 7: LeadingAndTrailingSpacesPreserved
//====================================================================================================
TEST_F(MenuTest, LeadingAndTrailingSpacesPreserved)
{
    simulateInput("  POST 1 101  \n");

    ConsoleMenu menu;

    std::string command = menu.nextCommand();

    EXPECT_EQ(command, "  POST 1 101  ")
        << "Leading and trailing spaces must be preserved";
}

//====================================================================================================
// Test 8: MultipleSpacesBetweenArgsPreserved
//====================================================================================================
TEST_F(MenuTest, MultipleSpacesBetweenArgsPreserved)
{
    simulateInput("POST    1    101   102\n");

    ConsoleMenu menu;

    std::string command = menu.nextCommand();

    EXPECT_EQ(command, "POST    1    101   102")
        << "Multiple spaces must not be collapsed";
}