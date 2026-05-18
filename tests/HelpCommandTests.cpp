
//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "commands/HelpCommand.h"
#include "commands/GetCommand.h"
#include "commands/PostCommand.h"
#include "output/IOutputWriter.h"
#include "output/IOutputWriter.h"
#include "storage/IDataStorage.h"
#include "ui/IMenu.h"


// ---- System ----
#include <gtest/gtest.h>
#include <sstream>
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

//This Menu exists only to construct the commandProvider for help. We don't really need a menu here.
//Same for the dummy as well MockStorage.
class MockMenu : public IMenu
{
public:
    std:: string nextCommand() noexcept override{
        return " ";
    }
};

class MockStorage : public IDataStorage
{
private:
    std::string m_filePath;
public:
    MockStorage(std::string path) : m_filePath(std::move(path)) {}
    void save(const std::string &userId, const std::vector<std::string> &products) override{
        return;
    }
    std::map<std::string, std::set<std::string>> loadAll(){
        return std::map<std::string, std::set<std::string>> ();
    }
};





//====================================================================================================
// Test 1: HelpExactOutput
//====================================================================================================
TEST_F(HelpCommandTest, HelpExactOutput)
{
    std::istringstream args("");
    MockWriter writer;
    MockMenu menu;
    MockStorage storage("test_data.txt");

// All commands MUST take the writer now
    // AddProductCommand addCmd(storage, writer);
    GetCommand getCmd(storage, writer);
    PostCommand postCmd(storage, writer);

    // Inject the writer into the App so it can report "400 Bad Request"
    App app(&menu, &writer); // Constructor injection
    HelpCommand helpCmd(writer, app);
    app.registerCommand("help", helpCmd);
    app.registerCommand("get", getCmd);
    app.registerCommand("post", postCmd);

    helpCmd.execute(args);

    // The assignment requires these 3 lines
    ASSERT_EQ(writer.messages.size(), 5);
    EXPECT_EQ(writer.messages[0], "DELETE, arguments: [userid] [productid1] [productid2] ...");
    EXPECT_EQ(writer.messages[1], "GET, arguments: [userid] [productid]");
    EXPECT_EQ(writer.messages[2], "PATCH, arguments: [userid] [productid1] [productid2] ...");
    EXPECT_EQ(writer.messages[3], "POST, arguments: [userid] [productid1] [productid2] ...");
    EXPECT_EQ(writer.messages[4], "help");
}


//====================================================================================================
// Test 2: HelpWithExtraArgsPrintsNothing
// Test 2: HelpWithExtraArgsPrintsNothing
//====================================================================================================
TEST_F(HelpCommandTest, HelpWithExtraArgsPrintsNothing)
{
    std::istringstream args("extra_junk");
    MockWriter writer;
    MockStorage storage("test_data.txt");
    MockMenu menu;
    // All commands MUST take the writer now
    // AddProductCommand addCmd(storage, writer);
    GetCommand getCmd(storage, writer);
    PostCommand postCmd(storage, writer);

    // Inject the writer into the App so it can report "400 Bad Request"
    App app(&menu, &writer); // Constructor injection
    HelpCommand helpCmd(writer, app);
    app.registerCommand("help", helpCmd);
    app.registerCommand("get", getCmd);
    app.registerCommand("post", postCmd);
    helpCmd.execute(args);

    // If extra args are present, it should print nothing (size 0)
     EXPECT_EQ(writer.messages.size(), 1);
     EXPECT_EQ(writer.messages[0], "400 Bad Request");
}

//====================================================================================================
// Test 3: HelpWithMultipleExtraArgs
// Purpose: "help foo bar baz" should also print nothing
//====================================================================================================
TEST_F(HelpCommandTest, HelpWithMultipleExtraArgs) {
    std::istringstream args("foo bar baz");
    MockWriter writer;
    MockStorage storage("test_data.txt");
    MockMenu menu;
    // All commands MUST take the writer now
    // AddProductCommand addCmd(storage, writer);
    GetCommand getCmd(storage, writer);
    PostCommand postCmd(storage, writer);

    // Inject the writer into the App so it can report "400 Bad Request"
    App app(&menu, &writer); // Constructor injection
    HelpCommand helpCmd(writer, app);
    app.registerCommand("help", helpCmd);
    app.registerCommand("get", getCmd);
    app.registerCommand("post", postCmd);

    helpCmd.execute(args);

    // If extra args are present, it should print nothing (size 0)
     EXPECT_EQ(writer.messages.size(), 1);
     EXPECT_EQ(writer.messages[0], "400 Bad Request");
}


//====================================================================================================
// Test 4: HelpWithOnlySpacesInArgs
//====================================================================================================
TEST_F(HelpCommandTest, HelpWithOnlySpacesInArgs)
{
    std::istringstream args("   ");
    MockWriter writer;
    MockStorage storage("test_data.txt");
    MockMenu menu;
    // All commands MUST take the writer now
    // AddProductCommand addCmd(storage, writer);
    GetCommand getCmd(storage, writer);
    PostCommand postCmd(storage, writer);

    // Inject the writer into the App so it can report "400 Bad Request"
    App app(&menu, &writer); // Constructor injection
    HelpCommand helpCmd(writer, app);
    app.registerCommand("help", helpCmd);
    app.registerCommand("get", getCmd);
    app.registerCommand("post", postCmd);

    helpCmd.execute(args);

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
    MockStorage storage("test_data.txt");
    MockMenu menu;
    // All commands MUST take the writer now
    // AddProductCommand addCmd(storage, writer);
    GetCommand getCmd(storage, writer);
    PostCommand postCmd(storage, writer);

    // Inject the writer into the App so it can report "400 Bad Request"
    App app(&menu, &writer); // Constructor injection
    HelpCommand helpCmd(writer, app);
    app.registerCommand("help", helpCmd);
    app.registerCommand("get", getCmd);
    app.registerCommand("post", postCmd);

    helpCmd.execute(args);

    //Tabsare not allowed
    EXPECT_EQ(writer.messages.size(), 1);
    EXPECT_EQ(writer.messages[0], "400 Bad Request");
}

