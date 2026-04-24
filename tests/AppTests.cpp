//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "App.h"
#include "ICommand.h"
#include "IDataStorage.h"

// ---- System ----
#include <gtest/gtest.h>
#include <sstream>

//====================================================================================================
// Helpers - MockMenu & MockCommand
// We use MOCK objects - fake implementations of our interfaces
// that let us control and observe behavior without real files or real menus
//====================================================================================================

/**
 * MockMenu: Simulates a menu that returns a fixed list of commands one by one
 * When the list runs out it returns "quit" to stop the loop in tests
 */
class MockMenu : public IMenu {
public:
    std::vector<std::string> commands;
    int index = 0;

    MockMenu(std::vector<std::string> cmds) : commands(std::move(cmds)) {}

    std::string nextCommand() override {
        if (index < commands.size()) {
            return commands[index++];
        }
        return "quit"; // signals the App loop to stop in tests
    }
};

/**
 * MockCommand: A fake command that just records whether execute() was called
 * Lets us verify the App dispatched to the right command
 */
class MockCommand : public ICommand {
public:
    bool wasCalled = false;
    std::string lastArgs;

    void execute(const std::string& args) override {
        wasCalled = true;
        lastArgs = args;
    }
};

//====================================================================================================
// Test 1: ProgramNeverExits
//====================================================================================================
TEST(AppTest, ProgramNeverExits) {
    // The idea here is to simulate a case where we get an invalid command before a valid one
    MockMenu menu({"invalidcmd", "help", "quit"});
    MockCommand helpCmd;

    // Initialize app and ket it know that "help" is valid (belongs to Mockcommand)
    App app(&menu);
    app.registerCommand("help", &helpCmd);
    app.run(); // Starts the loop, should not crash or hang

    // "help" was reached even after an invalid command — loop kept going
    EXPECT_TRUE(helpCmd.wasCalled)
        << "App should keep running after invalid input and process next command";
}

//====================================================================================================
// Test 2: UnknownCommandProducesNoOutput
//====================================================================================================
TEST(AppTest, UnknownCommandProducesNoOutput) {
    // Redirect cout to capture any output (so we can check what the app prints)
    std::ostringstream captured;
    std::streambuf* originalCout = std::cout.rdbuf(captured.rdbuf());

    // Running  the app with a command that doesn't exist
    MockMenu menu({"unknowncommand", "quit"});
    App app(&menu);
    app.run();

    std::cout.rdbuf(originalCout); // Restore cout so we wont break other tests

    // Verify the "captured" string is empty (need to silently handle of errors)
    EXPECT_TRUE(captured.str().empty())
        << "Unknown command should produce zero output";
}

//====================================================================================================
// Test 3: KnownCommandIsDispatched
//====================================================================================================
TEST(AppTest, KnownCommandIsDispatched) {
    // Here we get a known command
    MockMenu menu({"help", "quit"});
    MockCommand helpCmd;

    // Initialize app and ket it know that "help" is valid (belongs to Mockcommand)
    App app(&menu);
    app.registerCommand("help", &helpCmd);
    app.run(); // Starts the loop, should not crash or hang

    // "help" was reached in its internal map and was called
    EXPECT_TRUE(helpCmd.wasCalled)
        << "App should dispatch 'help' to the registered HelpCommand";
}

//====================================================================================================
// Test 4: CorrectArgsPassedToCommand
//====================================================================================================
TEST(AppTest, CorrectArgsPassedToCommand) {
    MockMenu menu({"add 1 101 102", "quit"});
    MockCommand addCmd;

    // Initialize app and ket it know that "add" is valid (belongs to Mockcommand)
    App app(&menu);
    app.registerCommand("add", &addCmd);
    app.run(); // Starts the loop, should not crash or hang

    // "add" was reached adn passed ONLY its data (loop kept going)
    EXPECT_TRUE(addCmd.wasCalled); // Ensuring the command was actually triggered
    EXPECT_EQ(addCmd.lastArgs, "1 101 102")
        << "Args after the command name should be passed to execute()";
}






