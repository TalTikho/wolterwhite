//====================================================================================================
// Include all needed headers
//====================================================================================================

// ---- Files ----
#include "App.h"
#include "ui/IMenu.h"
#include "commands/ICommand.h"
#include "output/IOutputWriter.h"

// ---- System ----
#include <gtest/gtest.h>
#include <sstream>
#include <vector>

//====================================================================================================
// MockWriter
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
};

//====================================================================================================
// MockMenu
//====================================================================================================
class MockMenu : public IMenu
{
public:
    std::vector<std::string> commands;
    size_t index = 0;

    MockMenu(std::vector<std::string> cmds) : commands(std::move(cmds)) {}

    std::string nextCommand() noexcept override
    {
        if (index < commands.size())
            return commands[index++];

        return "quit";
    }
};

//====================================================================================================
// MockCommand
//====================================================================================================
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

    const std::string getPrintoutFormat() override
    {
        return "mock";
    }
};

//====================================================================================================
// Test 1: ProgramNeverExits
//====================================================================================================
TEST(AppTest, ProgramNeverExits)
{
    MockMenu menu({"help", "quit"});
    MockWriter writer;
    App app(&menu, &writer);

    app.run();

    SUCCEED();
}

//====================================================================================================
// Test 2: UnknownCommandProducesBadRequest
//====================================================================================================
TEST(AppTest, UnknownCommandProducesBadRequest)
{
    MockMenu menu({"banana", "quit"});
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

    EXPECT_TRUE(helpCmd.wasCalled);
}

//====================================================================================================
// Test 4: CorrectArgsPassedToCommand
//====================================================================================================
TEST(AppTest, CorrectArgsPassedToCommand)
{
    MockMenu menu({"POST 1 101 102", "quit"});
    MockCommand postCmd;
    MockWriter writer;

    App app(&menu, &writer);
    app.registerCommand("post", postCmd);

    app.run();

    EXPECT_TRUE(postCmd.wasCalled);
    EXPECT_NE(postCmd.lastArgs.find("1 101 102"), std::string::npos);
}