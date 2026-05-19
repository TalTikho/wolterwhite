//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "commands/HelpCommand.h"
#include "commands/GetCommand.h"
#include "commands/PostCommand.h"
#include "commands/PatchCommand.h"
#include "commands/DeleteCommand.h"

#include "output/IOutputWriter.h"
#include "storage/IDataStorage.h"
#include "ui/IMenu.h"
#include "App.h"

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
};

class MockMenu : public IMenu
{
public:
    std::string nextCommand() noexcept override {
        return " ";
    }
};

class MockStorage : public IDataStorage
{
private:
    std::string m_filePath;
public:
    MockStorage(std::string path) : m_filePath(std::move(path)) {}
    void save(const std::string &userId, const std::vector<std::string> &products) override {
        return;
    }
    std::map<std::string, std::set<std::string>> loadAll() override {
        return std::map<std::string, std::set<std::string>>();
    }
};

//====================================================================================================
// Test 1: HelpExactOutput
//====================================================================================================
TEST_F(HelpCommandTest, HelpExactOutput) {
    std::istringstream args("");
    MockWriter writer;
    MockMenu menu;
    MockStorage storage("test_data.txt");

    // Heap allocate commands so we control when they die
    GetCommand*    getCmd    = new GetCommand(storage, writer);
    PostCommand*   postCmd   = new PostCommand(storage, writer);
    PatchCommand*  patchCmd  = new PatchCommand(storage, writer);
    DeleteCommand* deleteCmd = new DeleteCommand(storage, writer);

    App app(&menu, &writer);
    HelpCommand helpCmd(writer, app);

    app.registerCommand("GET",    *getCmd);
    app.registerCommand("DELETE", *deleteCmd);
    app.registerCommand("PATCH",  *patchCmd);
    app.registerCommand("POST",   *postCmd);
    app.registerCommand("help",   helpCmd);

    helpCmd.execute(args);

    ASSERT_EQ(writer.messages.size(), 5);
    EXPECT_EQ(writer.messages[0],
        "DELETE, arguments: [userid] [productid1] [productid2] ...\n");
    EXPECT_EQ(writer.messages[1],
        "GET, arguments: [userid] [productid]\n");
    EXPECT_EQ(writer.messages[2],
        "PATCH, arguments: [userid] [productid1] [productid2] ...\n");
    EXPECT_EQ(writer.messages[3],
        "POST, arguments: [userid] [productid1] [productid2] ...\n");
    EXPECT_EQ(writer.messages[4], "help\n");

    // Delete in safe order — commands before app
    delete getCmd;
    delete postCmd;
    delete patchCmd;
    delete deleteCmd;
    // app and helpCmd destroyed automatically after this
    // app is destroyed AFTER helpCmd because helpCmd was constructed after app
}

//====================================================================================================
// Test 2: HelpWithExtraArgsPrintsNothing
//====================================================================================================
TEST_F(HelpCommandTest, HelpWithExtraArgsPrintsNothing)
{
    std::istringstream args("extra_junk");
    MockWriter writer;
    MockStorage storage("test_data.txt");
    MockMenu menu;

    GetCommand getCmd(storage, writer);
    PostCommand postCmd(storage, writer);

    App app(&menu, &writer); 
    HelpCommand helpCmd(writer, app);
    
    app.registerCommand("help", helpCmd);
    app.registerCommand("get", getCmd);
    app.registerCommand("post", postCmd);
    
    helpCmd.execute(args);

    EXPECT_EQ(writer.messages.size(), 1);
    EXPECT_EQ(writer.messages[0], "400 Bad Request");
}

//====================================================================================================
// Test 3: HelpWithMultipleExtraArgs
//====================================================================================================
TEST_F(HelpCommandTest, HelpWithMultipleExtraArgs) 
{
    std::istringstream args("foo bar baz");
    MockWriter writer;
    MockStorage storage("test_data.txt");
    MockMenu menu;

    GetCommand getCmd(storage, writer);
    PostCommand postCmd(storage, writer);

    App app(&menu, &writer); 
    HelpCommand helpCmd(writer, app);
    
    app.registerCommand("help", helpCmd);
    app.registerCommand("get", getCmd);
    app.registerCommand("post", postCmd);

    helpCmd.execute(args);

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

    GetCommand getCmd(storage, writer);
    PostCommand postCmd(storage, writer);
    PatchCommand patchCmd(storage, writer);
    DeleteCommand deleteCmd(storage, writer);

    App app(&menu, &writer); 
    HelpCommand helpCmd(writer, app);
    
    app.registerCommand("help", helpCmd);
    app.registerCommand("get", getCmd);
    app.registerCommand("post", postCmd);
    app.registerCommand("patch", patchCmd);
    app.registerCommand("delete", deleteCmd);

    helpCmd.execute(args);

    // All 5 commands are registered now, so map size matches perfectly
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

    GetCommand getCmd(storage, writer);
    PostCommand postCmd(storage, writer);

    App app(&menu, &writer); 
    HelpCommand helpCmd(writer, app);
    
    app.registerCommand("help", helpCmd);
    app.registerCommand("get", getCmd);
    app.registerCommand("post", postCmd);

    helpCmd.execute(args);

    EXPECT_EQ(writer.messages.size(), 1);
    EXPECT_EQ(writer.messages[0], "400 Bad Request");
}