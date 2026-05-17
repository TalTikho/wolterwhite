//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "App.h"
#include "ui/IMenu.h"
#include "commands/ICommand.h"
#include "storage/IDataStorage.h"
#include "output/IOutputWriter.h" // Added header

// ---- System ----
#include <gtest/gtest.h>
#include <sstream>
#include <vector>

//====================================================================================================
// Helpers - MockMenu, MockCommand, & MockWriter
//====================================================================================================
/**
 * MockWriter: Needed to satisfy the App constructor.
 * Records messages so we can verify "400 Bad Request" responses.
 */
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

class MockMenu : public IMenu
{
public:
    std::vector<std::string> commands;
    size_t index = 0;
    MockMenu(std::vector<std::string> cmds) : commands(std::move(cmds)) {}

    std::string nextCommand() noexcept override
    {
        if (index < commands.size())
        {
            return commands[index++];
        }
        return "quit";
    }
};

class MockCommand : public ICommand
{
public:
    bool wasCalled = false;
    std::string lastArgs;
    void execute(std::istringstream &args) override
    {
        wasCalled = true;
        std::getline(args, lastArgs);
    }
};

//====================================================================================================
// Test 1: ProgramNeverExits (Until 'quit')
//====================================================================================================
TEST(AppTest, ProgramNeverExits)
{
    MockMenu menu({"command1", "command2"});
    MockWriter writer;
    App app(&menu, &writer); // Pass writer as 2nd argument
    app.run();

    SUCCEED();
}

//====================================================================================================
// Test 2: UnknownCommandProducesBadRequest
// Updated: Ex2 requirement says unknown commands return "400 Bad Request"
//====================================================================================================
TEST(AppTest, UnknownCommandProducesBadRequest)
{
    MockMenu menu({"unknown", "quit"});
    MockWriter writer;
    App app(&menu, &writer);
    app.run();

    EXPECT_EQ(writer.lastMessage, "400 Bad Request");
}

//====================================================================================================
// Test 3: KnownCommandIsDispatched
//====================================================================================================
TEST(AppTest, KnownCommandIsDispatched)
{
    MockMenu menu({"help", "quit"});
    MockCommand helpCmd;
    MockWriter writer;

    App app(&menu, &writer);
    app.registerCommand("help", helpCmd);
    app.run();

    EXPECT_TRUE(helpCmd.wasCalled)
        << "App should dispatch 'help' to the registered HelpCommand";
}

//====================================================================================================
// Test 4: CorrectArgsPassedToCommand
//====================================================================================================
TEST(AppTest, CorrectArgsPassedToCommand)
{
    MockMenu menu({"add 1 101 102", "quit"});
    MockCommand addCmd;
    MockWriter writer;

    App app(&menu, &writer);
    app.registerCommand("add", addCmd);
    app.run();

    EXPECT_TRUE(addCmd.wasCalled);
    // Trim potential leading/trailing space from stream logic
    EXPECT_TRUE(addCmd.lastArgs.find("1 101 102") != std::string::npos);
}