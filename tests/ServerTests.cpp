//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "../include/AllIncludes.h"
#include "../include/ui/SocketClientHandler.h"
#include "../include/server/TCPServer.h"
#include "../include/commands/ICommandProvider.h"

// ---- System ----
#include <gtest/gtest.h>
#include <thread>
#include <string>
#include <vector>
#include <filesystem>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <chrono>

//===================================================================================================
// Constants
//====================================================================================================
static const std::string SERVER_TEST_FILE = "data/test_server_storage.txt";
static const std::string LOCALHOST = "127.0.0.1";

// Individual ports reserved for server isolation tests
static const int PORT_POST_VALID = 19001;
static const int PORT_POST_EXISTS = 19002;
static const int PORT_POST_NO_PRODUCT = 19003;
static const int PORT_POST_EMPTY = 19004;
static const int PORT_PATCH_VALID = 19005;
static const int PORT_PATCH_NOUSER = 19006;
static const int PORT_PATCH_NO_PRODUCT = 19007;
static const int PORT_DELETE_VALID = 19008;
static const int PORT_DELETE_NO_USER = 19009;
static const int PORT_DELETE_PARTIAL = 19010;
static const int PORT_GET_VALID = 19011;
static const int PORT_GET_NO_USER = 19012;
static const int PORT_GET_PARADOX = 19013;
static const int PORT_MALFORMED = 19014;
static const int PORT_TABS = 19015;
static const int PORT_HELP = 19016;
static const int PORT_PERSISTENCE = 19017;

//====================================================================================================
// Test Fixture
//====================================================================================================
class ServerTest : public ::testing::Test
{
protected:
    void SetUp() override
    {
        std::filesystem::remove(SERVER_TEST_FILE);
    }

    void TearDown() override
    {
        std::filesystem::remove(SERVER_TEST_FILE);
    }

    // Helper to seed the database file for server tests
    void seedUser(const std::string &userId, const std::vector<std::string> &products)
    {
        FileDataStorage storage(SERVER_TEST_FILE);
        storage.save(userId, products);
    }
};

//====================================================================================================
// Server Background Thread Helper Function
//====================================================================================================
std::thread startServer(int port)
{
    return std::thread([port]() {
        FileDataStorage storage(SERVER_TEST_FILE);
        TCPServer server(port);
        server.start();

        int clientFd = server.acceptClient();
        if (clientFd < 0) {
            server.stop();
            return;
        }

        SocketClientHandler handler(clientFd);
        SocketWriter writer(clientFd);

        DeleteCommand deleteCmd(storage, writer);
        GetCommand getCmd(storage, writer);
        PatchCommand patchCmd(storage, writer);
        PostCommand postCmd(storage, writer);

        App app(&handler, &writer);
        HelpCommand helpCmd(writer, app);

        app.registerCommand("get", getCmd);
        app.registerCommand("delete", deleteCmd);
        app.registerCommand("patch", patchCmd);
        app.registerCommand("post", postCmd);
        app.registerCommand("help", helpCmd);

        app.run();

        close(clientFd);
        server.stop();
    });
}

//====================================================================================================
// Sends a command and cleanly closes the socket connection
//====================================================================================================
std::string sendAndReceive(int port, const std::string &command)
{
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) return "";

    sockaddr_in serverAddr{};
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(port);
    inet_pton(AF_INET, LOCALHOST.c_str(), &serverAddr.sin_addr);

    // Try connecting until server is active
    while (connect(sock, (struct sockaddr *)&serverAddr, sizeof(serverAddr)) < 0)
    {
        std::this_thread::sleep_for(std::chrono::milliseconds(10));
    }

    std::string packet = command + "\n";
    send(sock, packet.c_str(), packet.length(), 0);

    // Tell the server we are finished writing so it breaks out of nextCommand() loop
    shutdown(sock, SHUT_WR);

    char buffer[4096];
    std::string response;
    ssize_t bytesRead;
    while ((bytesRead = recv(sock, buffer, sizeof(buffer) - 1, 0)) > 0)
    {
        buffer[bytesRead] = '\0';
        response += buffer;
    }

    // Cleanly close file descriptor
    close(sock);
    return response;
}

//====================================================================================================
// Sends multiple commands sequentially and closes connection
//====================================================================================================
std::string sendAndReceiveMultiple(int port, const std::vector<std::string> &commands)
{
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) return "";

    sockaddr_in serverAddr{};
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(port);
    inet_pton(AF_INET, LOCALHOST.c_str(), &serverAddr.sin_addr);

    while (connect(sock, (struct sockaddr *)&serverAddr, sizeof(serverAddr)) < 0)
    {
        std::this_thread::sleep_for(std::chrono::milliseconds(10));
    }

    for (const auto &cmd : commands)
    {
        std::string packet = cmd + "\n";
        send(sock, packet.c_str(), packet.length(), 0);
    }

    // Signal execution end to the server application
    shutdown(sock, SHUT_WR);

    char buffer[4096];
    std::string fullResponse;
    ssize_t bytesRead;
    while ((bytesRead = recv(sock, buffer, sizeof(buffer) - 1, 0)) > 0)
    {
        buffer[bytesRead] = '\0';
        fullResponse += buffer;
    }

    // Clean up connection
    close(sock);
    return fullResponse;
}

//====================================================================================================
// 1. PostNewUser
//====================================================================================================
TEST_F(ServerTest, PostNewUser)
{
    auto serverThread = startServer(PORT_POST_VALID);
    std::string response = sendAndReceive(PORT_POST_VALID, "post 1 101 102");
    serverThread.join();

    EXPECT_TRUE(response.find("201 Created") != std::string::npos);
}

//====================================================================================================
// 2. PostExistingUserAccumulates
//====================================================================================================
TEST_F(ServerTest, PostExistingUserAccumulates)
{
    seedUser("1", {"101"});
    auto serverThread = startServer(PORT_POST_EXISTS);
    std::string response = sendAndReceive(PORT_POST_EXISTS, "post 1 102");
    serverThread.join();

    EXPECT_TRUE(response.find("404 Not Found") != std::string::npos);
}

//====================================================================================================
// 3. PostMissingProductId
//====================================================================================================
TEST_F(ServerTest, PostMissingProductId)
{
    auto serverThread = startServer(PORT_POST_NO_PRODUCT);
    std::string response = sendAndReceive(PORT_POST_NO_PRODUCT, "post 1");
    serverThread.join();

    EXPECT_TRUE(response.find("400 Bad Request") != std::string::npos);
}

//====================================================================================================
// 4. PostEmptyArgs
//====================================================================================================
TEST_F(ServerTest, PostEmptyArgs)
{
    auto serverThread = startServer(PORT_POST_EMPTY);
    std::string response = sendAndReceive(PORT_POST_EMPTY, "post ");
    serverThread.join();

    EXPECT_TRUE(response.find("400 Bad Request") != std::string::npos);
}

//====================================================================================================
// 5. PatchExistingUser
//====================================================================================================
TEST_F(ServerTest, PatchExistingUser)
{
    seedUser("1", {"101"});
    auto serverThread = startServer(PORT_PATCH_VALID);
    std::string response = sendAndReceive(PORT_PATCH_VALID, "patch 1 102");
    serverThread.join();

    EXPECT_TRUE(response.find("204 No Content") != std::string::npos);
}

//====================================================================================================
// 6. PatchNoUser
//====================================================================================================
TEST_F(ServerTest, PatchNoUser)
{
    auto serverThread = startServer(PORT_PATCH_NOUSER);
    std::string response = sendAndReceive(PORT_PATCH_NOUSER, "patch 1 102");
    serverThread.join();

    EXPECT_TRUE(response.find("404 Not Found") != std::string::npos);
}

//====================================================================================================
// 7. PatchMissingProductId
//====================================================================================================
TEST_F(ServerTest, PatchMissingProductId)
{
    seedUser("1", {"101"});
    auto serverThread = startServer(PORT_PATCH_NO_PRODUCT);
    std::string response = sendAndReceive(PORT_PATCH_NO_PRODUCT, "patch 1");
    serverThread.join();

    EXPECT_TRUE(response.find("400 Bad Request") != std::string::npos);
}

//====================================================================================================
// 8. DeleteValidProducts
//====================================================================================================
TEST_F(ServerTest, DeleteValidProducts)
{
    seedUser("1", {"101", "102"});
    auto serverThread = startServer(PORT_DELETE_VALID);
    std::string response = sendAndReceive(PORT_DELETE_VALID, "delete 1 101");
    serverThread.join();

    EXPECT_TRUE(response.find("204 No Content") != std::string::npos);
}

//====================================================================================================
// 9. DeleteNoUser
//====================================================================================================
TEST_F(ServerTest, DeleteNoUser)
{
    auto serverThread = startServer(PORT_DELETE_NO_USER);
    std::string response = sendAndReceive(PORT_DELETE_NO_USER, "delete 1 101");
    serverThread.join();

    EXPECT_TRUE(response.find("404 Not Found") != std::string::npos);
}

//====================================================================================================
// 10. DeletePartialMissingProductFailsAtomic
//====================================================================================================
TEST_F(ServerTest, DeletePartialMissingProductFailsAtomic)
{
    seedUser("1", {"101"});
    auto serverThread = startServer(PORT_DELETE_PARTIAL);
    std::string response = sendAndReceive(PORT_DELETE_PARTIAL, "delete 1 101 999");
    serverThread.join();

    EXPECT_TRUE(response.find("404 Not Found") != std::string::npos);
}

//====================================================================================================
// 11. GetValidRecommendations
//====================================================================================================
TEST_F(ServerTest, GetValidRecommendations)
{
    seedUser("1", {"101"});
    seedUser("2", {"101", "102"});
    auto serverThread = startServer(PORT_GET_VALID);
    std::string response = sendAndReceive(PORT_GET_VALID, "get 1 101");
    serverThread.join();

    EXPECT_TRUE(response.find("200 OK") != std::string::npos);
    EXPECT_TRUE(response.find("102") != std::string::npos);
}

//====================================================================================================
// 12. GetNoUser
//====================================================================================================
TEST_F(ServerTest, GetNoUser)
{
    auto serverThread = startServer(PORT_GET_NO_USER);
    std::string response = sendAndReceive(PORT_GET_NO_USER, "get 1 101");
    serverThread.join();

    EXPECT_TRUE(response.find("404 Not Found") != std::string::npos);
}

//====================================================================================================
// 13. GetTargetProductParadox
//====================================================================================================
TEST_F(ServerTest, GetTargetProductParadox)
{
    seedUser("1", {"101"});
    seedUser("2", {"101"});
    auto serverThread = startServer(PORT_GET_PARADOX);
    std::string response = sendAndReceive(PORT_GET_PARADOX, "get 1 101");
    serverThread.join();

    EXPECT_TRUE(response.find("404 Not Found") != std::string::npos);
}

//====================================================================================================
// 14. UnknownCommandProducesBadRequest
//====================================================================================================
TEST_F(ServerTest, UnknownCommandProducesBadRequest)
{
    auto serverThread = startServer(PORT_MALFORMED);
    std::string response = sendAndReceive(PORT_MALFORMED, "banana 1 2 3");
    serverThread.join();

    EXPECT_TRUE(response.find("400 Bad Request") != std::string::npos);
}

//====================================================================================================
// 15. CommandContainingTabsIsRejected
//====================================================================================================
TEST_F(ServerTest, CommandContainingTabsIsRejected)
{
    auto serverThread = startServer(PORT_TABS);
    std::string response = sendAndReceive(PORT_TABS, "post\t1\t101");
    serverThread.join();

    EXPECT_TRUE(response.find("400 Bad Request") != std::string::npos);
}

//====================================================================================================
// 16. HelpMenuPrintedOnConnection
//====================================================================================================
TEST_F(ServerTest, HelpMenuPrintedOnConnection)
{
    auto serverThread = startServer(PORT_HELP);
    std::string fullResponse = sendAndReceiveMultiple(PORT_HELP, {"get 1 101"});
    serverThread.join();

    EXPECT_TRUE(fullResponse.find("GET, arguments:") != std::string::npos);
}

//====================================================================================================
// 17. DataPersistsAfterRestart
//====================================================================================================
TEST_F(ServerTest, DataPersistsAfterRestart)
{
    {
        auto serverThread = startServer(PORT_PERSISTENCE);
        std::vector<std::string> setupCommands = {
            "post 1 101",
            "post 2 101 102"};
        sendAndReceiveMultiple(PORT_PERSISTENCE, setupCommands);
        serverThread.join();
    }

    std::this_thread::sleep_for(std::chrono::milliseconds(250));

    {
        auto serverThread = startServer(PORT_PERSISTENCE);
        std::string response = sendAndReceive(PORT_PERSISTENCE, "get 1 101");
        serverThread.join();

        EXPECT_TRUE(response.find("200 OK") != std::string::npos);
        EXPECT_TRUE(response.find("102") != std::string::npos);
    }
}