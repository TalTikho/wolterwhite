//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "../include/AllIncludes.h"
#include "server/TCPServer.h" //NEEDED wont work without it

// ---- System ----
#include <unistd.h>

//====================================================================================================
int main(int argc, char *argv[])
{
    if (argc < 2)
    {
        std::cerr << "Usage: " << argv[0] << " <port>\n";
        return 1;
    }

    int port = std::stoi(argv[1]);

    FileDataStorage storage("data/data.txt");

    // Set up TCP server
    TCPServer server(port);
    server.start();
    int clientFd = server.acceptClient();

    // SocketClientHandler implements BOTH IMenu + IOutputWriter
    // via the same socket fd
    SocketClientHandler handler(clientFd);

    // SocketWriter for commands to send their responses
    SocketWriter writer(clientFd);

    // Commands — identical structure to Exercise 1
    // Just different writer (SocketWriter instead of ConsoleWriter)
    HelpCommand helpCmd(writer);
    PostCommand postCmd(storage, writer);
    RecommendCommand recCmd(storage, writer);

    // App — IDENTICAL call
    // handler satisfies both IMenu* and IOutputWriter*
    App app(&handler, &handler);

    app.registerCommand("help", helpCmd);
    app.registerCommand("POST", postCmd);
    app.registerCommand("recommend", recCmd);

    app.run(); // stops when SocketClientHandler disconnects

    close(clientFd);
    return 0;
}