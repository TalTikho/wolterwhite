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
static const int PORT_GET_VALID = 19008;
static const int PORT_GET_NOUSER = 19009;
static const int PORT_DELETE_VALID = 19010;
static const int PORT_DELETE_NOUSER = 19011;
static const int PORT_DELETE_NOPRODUCT = 19012;
static const int PORT_BAD_REQUEST = 19013;
static const int PORT_HELP = 19014;
static const int PORT_MULTI_CMD = 19015;
static const int PORT_TAB_REJECTED = 19016;
static const int PORT_PERSISTENCE = 19017;

//====================================================================================================
// sendAndReceive: Simulated Single Command Client Loop
//====================================================================================================
static std::string sendAndReceive(int port, const std::string &command)
{
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0)
        return "ERROR: could not create socket";

    struct sockaddr_in serverAddr{};
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(port);
    inet_pton(AF_INET, LOCALHOST.c_str(), &serverAddr.sin_addr);

    if (connect(sock, (struct sockaddr *)&serverAddr, sizeof(serverAddr)) < 0)
    {
        close(sock);
        return "ERROR: could not connect";
    }

    std::string toSend = command + "\n";
    send(sock, toSend.c_str(), toSend.size(), 0);

    std::string response;
    char buffer[1024];
    int bytesRead;
    while ((bytesRead = recv(sock, buffer, sizeof(buffer) - 1, 0)) > 0)
    {
        buffer[bytesRead] = '\0';
        response += buffer;
    }

    close(sock);
    return response;
}

//====================================================================================================
// sendAndReceiveMultiple: Safe Timeout-Drained Multi Command Client Loop
//====================================================================================================
static std::string sendAndReceiveMultiple(int port, const std::vector<std::string> &commands)
{
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0)
        return "ERROR: could not create socket";

    struct sockaddr_in serverAddr{};
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(port);
    inet_pton(AF_INET, LOCALHOST.c_str(), &serverAddr.sin_addr);

    if (connect(sock, (struct sockaddr *)&serverAddr, sizeof(serverAddr)) < 0)
    {
        close(sock);
        return "ERROR: could not connect";
    }

    // Apply 100ms reading timeout to reliably collect multi-line text blocks
    struct timeval tv;
    tv.tv_sec = 0;
    tv.tv_usec = 100000;
    setsockopt(sock, SOL_SOCKET, SO_RCVTIMEO, (const char *)&tv, sizeof(tv));

    std::string fullResponse;

    for (const std::string &command : commands)
    {
        std::string toSend = command + "\n";
        if (send(sock, toSend.c_str(), toSend.size(), 0) < 0)
            break;

        char buffer[1024];
        int bytesRead;
        while (true)
        {
            bytesRead = recv(sock, buffer, sizeof(buffer) - 1, 0);
            if (bytesRead > 0)
            {
                buffer[bytesRead] = '\0';
                fullResponse += buffer;
            }
            else
            {
                break; // Timeout triggered or stream buffer drained
            }
        }
    }

    close(sock);
    return fullResponse;
}

//====================================================================================================
// runServer: Mirrors your exact main.cpp signatures, layout order, and lowercase routing keys
//====================================================================================================
static void runServer(int port)
{
    FileDataStorage storage(SERVER_TEST_FILE);

    TCPServer server(port);
    server.start();
    int clientFd = server.acceptClient();

    SocketClientHandler handler(clientFd);
    SocketWriter writer(clientFd);

    // Command Instantiations
    DeleteCommand deleteCmd(storage, writer);
    GetCommand getCmd(storage, writer);
    PatchCommand patchCmd(storage, writer);
    PostCommand postCmd(storage, writer);

    // App Initialization (Constructor injection using your &handler and &writer arguments)
    App app(&handler, &writer);

    // HelpCommand Initialization matching your exact constructor parameters: (writer, app)
    HelpCommand helpCmd(writer, app);

    // Register commands matching your lowercase registration layout strings
    app.registerCommand("get", getCmd);
    app.registerCommand("delete", deleteCmd);
    app.registerCommand("patch", patchCmd);
    app.registerCommand("post", postCmd);
    app.registerCommand("help", helpCmd);

    app.run();

    close(clientFd);
}

//====================================================================================================
// Test Fixture Setup
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

    std::thread startServer(int port)
    {
        std::thread t(runServer, port);
        std::this_thread::sleep_for(std::chrono::milliseconds(50));
        return t;
    }

    void seedUser(const std::string &userId, const std::vector<std::string> &products)
    {
        FileDataStorage storage(SERVER_TEST_FILE);
        storage.save(userId, products);
    }
};

//====================================================================================================
// ---- POST Tests -----------------------------------------------------------------------------------
//====================================================================================================
// Test 1: PostNewUser
// Purpose: Verifies that a brand new user profile can be created successfully.
// Expected Output: Returns "201 Created\n" and verifies data persistence in the flat file.
//====================================================================================================
TEST_F(ServerTest, PostNewUser)
{
    auto serverThread = startServer(PORT_POST_VALID);
    std::string response = sendAndReceive(PORT_POST_VALID, "post 1 101 102");
    serverThread.join();

    EXPECT_EQ(response, "201 Created\n");

    FileDataStorage storage(SERVER_TEST_FILE);
    auto data = storage.loadAll();
    ASSERT_TRUE(data.count("1") > 0);
    EXPECT_TRUE(data["1"].count("101") > 0);
    EXPECT_TRUE(data["1"].count("102") > 0);
}

//====================================================================================================
// Test 2: PostExistingUser
// Purpose: Validates that attempting to POST a user ID that already exists is handled as an error.
// Expected Output: Returns "404 Not Found\n" and leaves the initial data store safe and uncorrupted.
//====================================================================================================
TEST_F(ServerTest, PostExistingUser)
{
    seedUser("1", {"101"});
    auto serverThread = startServer(PORT_POST_EXISTS);
    std::string response = sendAndReceive(PORT_POST_EXISTS, "post 1 102");
    serverThread.join();

    EXPECT_EQ(response, "404 Not Found\n");
}

//====================================================================================================
// Test 3: PostNoProductId
// Purpose: Checks parsing error boundaries when a user ID is supplied but product sequence strings are missing.
// Expected Output: Fails validation cleanly, yielding a "400 Bad Request\n" protocol message.
//====================================================================================================
TEST_F(ServerTest, PostNoProductId)
{
    auto serverThread = startServer(PORT_POST_NO_PRODUCT);
    std::string response = sendAndReceive(PORT_POST_NO_PRODUCT, "post 1");
    serverThread.join();

    EXPECT_EQ(response, "400 Bad Request\n");
}

//====================================================================================================
// Test 4 PostEmptyCommand
// Purpose: Evaluates system behavior when the base command keyword "post" is transmitted without any arguments.
// Expected Output: Safely rejects the malformed layout stream with a "400 Bad Request\n" reply.
//====================================================================================================
TEST_F(ServerTest, PostEmptyCommand)
{
    auto serverThread = startServer(PORT_POST_EMPTY);
    std::string response = sendAndReceive(PORT_POST_EMPTY, "post");
    serverThread.join();

    EXPECT_EQ(response, "400 Bad Request\n");
}

//====================================================================================================
// ---- PATCH Tests ----------------------------------------------------------------------------------
//====================================================================================================
// Test 5: PatchExistingUser
// Purpose: Verifies that product items can be successfully appended to a pre-existing user account.
// Expected Output: Returns "204 No Content\n" and verifies that the new product target exists inside the storage file.
//====================================================================================================
TEST_F(ServerTest, PatchExistingUser)
{
    seedUser("1", {"101"});
    auto serverThread = startServer(PORT_PATCH_VALID);
    std::string response = sendAndReceive(PORT_PATCH_VALID, "patch 1 102 103");
    serverThread.join();

    EXPECT_EQ(response, "204 No Content\n");

    FileDataStorage storage(SERVER_TEST_FILE);
    auto data = storage.loadAll();
    EXPECT_TRUE(data["1"].count("102") > 0);
}

//====================================================================================================
// Test 6: PatchNonExistingUser
// Purpose: Confirms that modifying an unregistered user ID via PATCH commands is explicitly rejected.
// Expected Output: Emits a "404 Not Found\n" alert without modifying any database indexes.
//====================================================================================================
TEST_F(ServerTest, PatchNonExistingUser)
{
    auto serverThread = startServer(PORT_PATCH_NOUSER);
    std::string response = sendAndReceive(PORT_PATCH_NOUSER, "patch 1 101");
    serverThread.join();

    EXPECT_EQ(response, "404 Not Found\n");
}

//====================================================================================================
// Test 7: PatchNoProductId
// Purpose: Tests input validation stability when a user ID is supplied to PATCH but accompanying products are left blank.
// Expected Output: Breaks routing gracefully, outputting a "400 Bad Request\n" back to the client socket.
//====================================================================================================
TEST_F(ServerTest, PatchNoProductId)
{
    seedUser("1", {"101"});
    auto serverThread = startServer(PORT_PATCH_NO_PRODUCT);
    std::string response = sendAndReceive(PORT_PATCH_NO_PRODUCT, "patch 1");
    serverThread.join();

    EXPECT_EQ(response, "400 Bad Request\n");
}

//====================================================================================================
// ---- GET Tests ------------------------------------------------------------------------------------
//====================================================================================================
// Test 8: GetRecommendations
// Purpose: Seeds a full multi-user matrix to evaluate structural precision and sorting order accuracy inside the core recommendation algorithm.
// Expected Output: Yields a "200 Ok\n\n" status banner followed by a space-delimited list matching expected similarity indexes.
//====================================================================================================
TEST_F(ServerTest, GetRecommendations)
{
    seedUser("1", {"100", "101", "102", "103"});
    seedUser("2", {"101", "102", "104", "105", "106"});
    seedUser("3", {"100", "104", "105", "107", "108"});
    seedUser("4", {"101", "105", "106", "107", "109", "110"});
    seedUser("5", {"100", "102", "103", "105", "108", "111"});
    seedUser("6", {"100", "103", "104", "110", "111", "112", "113"});
    seedUser("7", {"102", "105", "106", "107", "108", "109", "110"});
    seedUser("8", {"101", "104", "105", "106", "109", "111", "114"});
    seedUser("9", {"100", "103", "105", "107", "112", "113", "115"});
    seedUser("10", {"100", "102", "105", "106", "107", "109", "110", "116"});

    auto serverThread = startServer(PORT_GET_VALID);
    std::string response = sendAndReceive(PORT_GET_VALID, "get 1 104");
    serverThread.join();

    std::string expected = "200 Ok\n\n105 106 111 110 112 113 107 108 109 114\n";
    EXPECT_EQ(response, expected);
}

//====================================================================================================
// Test 9: GetNonExistingUser
// Purpose: Ensures query operations fail correctly if recommendation matrices are queried for an unrecognized user token.
// Expected Output: Returns a "404 Not Found\n" status code down the stream.
//====================================================================================================
TEST_F(ServerTest, GetNonExistingUser)
{
    auto serverThread = startServer(PORT_GET_NOUSER);
    std::string response = sendAndReceive(PORT_GET_NOUSER, "get 999 101");
    serverThread.join();

    EXPECT_EQ(response, "404 Not Found\n");
}

//====================================================================================================
// ---- DELETE Tests ---------------------------------------------------------------------------------
//====================================================================================================
// Test 10: DeleteExistingProducts
// Purpose: Validates removing specific targeted products from a designated active user profile history.
// Expected Output: Returns "204 No Content\n", dropping the specified tags from the storage dictionary while keeping unrelated files intact.
//====================================================================================================
TEST_F(ServerTest, DeleteExistingProducts)
{
    seedUser("1", {"101", "102", "103"});

    auto serverThread = startServer(PORT_DELETE_VALID);
    std::string response = sendAndReceive(PORT_DELETE_VALID, "delete 1 101 102");
    serverThread.join();

    EXPECT_EQ(response, "204 No Content\n");

    FileDataStorage storage(SERVER_TEST_FILE);
    auto data = storage.loadAll();
    EXPECT_FALSE(data["1"].count("101") > 0);
    EXPECT_TRUE(data["1"].count("103") > 0);
}

//====================================================================================================
// Test 11: DeleteNonExistingUser
// Purpose: Assures structural integrity by confirming that targeting a deletion action toward an missing profile is rejected.
// Expected Output: Safely responds to the client application loop with a "404 Not Found\n" banner.
//====================================================================================================
TEST_F(ServerTest, DeleteNonExistingUser)
{
    auto serverThread = startServer(PORT_DELETE_NOUSER);
    std::string response = sendAndReceive(PORT_DELETE_NOUSER, "delete 999 101");
    serverThread.join();

    EXPECT_EQ(response, "404 Not Found\n");
}

//====================================================================================================
// Test 12: DeleteNonExistingProduct
// Purpose: Confirms user record isolation by checking behavior when trying to erase an unmapped product from a valid user.
// Expected Output: Throws an explicit "404 Not Found\n" state to indicate atomic data modification failure.
//====================================================================================================
TEST_F(ServerTest, DeleteNonExistingProduct)
{
    seedUser("1", {"101"});

    auto serverThread = startServer(PORT_DELETE_NOPRODUCT);
    std::string response = sendAndReceive(PORT_DELETE_NOPRODUCT, "delete 1 999");
    serverThread.join();

    EXPECT_EQ(response, "404 Not Found\n");
}

//====================================================================================================
// ---- System Tests ---------------------------------------------------------------------------------
//====================================================================================================
// Test 13: BadRequest
// Purpose: Confirms routing safety blocks drop completely unrecognized parsing parameters cleanly.
// Expected Output: Falls gracefully into app engine error management patterns, printing a "400 Bad Request\n".
//====================================================================================================
TEST_F(ServerTest, BadRequest)
{
    auto serverThread = startServer(PORT_BAD_REQUEST);
    std::string response = sendAndReceive(PORT_BAD_REQUEST, "unknowncommand 1 2 3");
    serverThread.join();

    EXPECT_EQ(response, "400 Bad Request\n");
}

//====================================================================================================
// Test 14: TabRejected
// Purpose: Validates delimiter constraint checks by confirming that formatting via tabs (\t) instead of plain spaces is treated as bad syntax.
// Expected Output: Identifies line string token anomalies early, writing back a "400 Bad Request\n".
//====================================================================================================
TEST_F(ServerTest, TabRejected)
{
    auto serverThread = startServer(PORT_TAB_REJECTED);
    std::string response = sendAndReceive(PORT_TAB_REJECTED, "post\t1\t101");
    serverThread.join();

    EXPECT_EQ(response, "400 Bad Request\n");
}

//====================================================================================================
// Test 15: HelpCommand
// Purpose: Evaluates system reflection capabilities by confirming that the "help" directory lists out active operational commands alphabetically.
// Expected Output: Returns full multi-line instructions containing references to registered keys like "get", "delete", "patch", and "post".
//====================================================================================================
TEST_F(ServerTest, HelpCommand)
{
    auto serverThread = startServer(PORT_HELP);
    std::string response = sendAndReceive(PORT_HELP, "help");
    serverThread.join();

    // Verifies lowercase dynamic string registration map locations
    EXPECT_TRUE(response.find("delete") != std::string::npos);
    EXPECT_TRUE(response.find("get") != std::string::npos);
    EXPECT_TRUE(response.find("patch") != std::string::npos);
    EXPECT_TRUE(response.find("post") != std::string::npos);
    EXPECT_TRUE(response.find("help") != std::string::npos);
}

//====================================================================================================
// Test 16: MultipleCommandsSameConnection
// Purpose: Validates socket link endurance by piping multiple updates down a singular, persistent TCP stream loop without disconnects.
// Expected Output: Confirms sequentially parsing "201 Created", "204 No Content", and "200 Ok" blocks accurately over one channel.
//====================================================================================================
TEST_F(ServerTest, MultipleCommandsSameConnection)
{
    seedUser("2", {"101", "102", "103"});
    seedUser("3", {"101", "102", "104"});

    auto serverThread = startServer(PORT_MULTI_CMD);

    std::vector<std::string> commands = {
        "post 1 101",
        "patch 1 102",
        "get 1 101"};

    std::string fullResponse = sendAndReceiveMultiple(PORT_MULTI_CMD, commands);
    serverThread.join();

    EXPECT_TRUE(fullResponse.find("201 Created") != std::string::npos);
    EXPECT_TRUE(fullResponse.find("204 No Content") != std::string::npos);
    EXPECT_TRUE(fullResponse.find("200 Ok") != std::string::npos);
}

//====================================================================================================
// Test 17: DataPersistsAfterRestart
// Purpose: Validates database cold-boot stability by launching a server, seeding values, wiping memory tracking entirely, and restoring on the same file.
// Expected Output: Confirms data persists across distinct applicationlifecycles, enabling the next server stream to accurately query old data.
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

    // Give the Linux network stack 250ms to release PORT_PERSISTENCE from TIME_WAIT boundary
    std::this_thread::sleep_for(std::chrono::milliseconds(250));

    {
        auto serverThread = startServer(PORT_PERSISTENCE);
        std::string response = sendAndReceive(PORT_PERSISTENCE, "get 1 101");
        serverThread.join();

        EXPECT_TRUE(response.find("200 Ok") != std::string::npos);
        EXPECT_TRUE(response.find("102") != std::string::npos);
    }
}