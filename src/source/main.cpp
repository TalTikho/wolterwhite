//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "../include/AllIncludes.h"
#include "server/TCPServer.h" //NEEDED wont work without it

// ---- System ----
#include <unistd.h>

//====================================================================================================
<<<<<<< HEAD
int main(int argc, char argv[])
=======
int main(int argc, char *argv[])
>>>>>>> origin/main
{
    if (argc < 2)
    {
        std::cerr << "Usage: " << argv[0] << " <port>\n";
        return 1;
    }

    int port = std::stoi(argv[1]);

    FileDataStorage storage("data/data.txt");
<<<<<<< HEAD

    // Set up TCP server
    TCPServer server(port);
    server.start();
    int clientFd = server.acceptClient();

    // SocketClientHandler implements BOTH IMenu + IOutputWriter
    // via the same socket fd
    SocketClientHandler handler(clientFd);

    // SocketWriter for commands to send their responses
    SocketWriter writer(clientFd);

    // All commands MUST take the writer now
    // AddProductCommand addCmd(storage, cw);
    RecommendCommand rec(storage, cw);
    PostCommand post(storage, cw);

    // Inject the writer into the App so it can report "400 Bad Request"
    App app(&menu, &cw);
    HelpCommand helpCmd(cw, app);
=======

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
>>>>>>> origin/main

    app.registerCommand("help", helpCmd);
    app.registerCommand("POST", postCmd);
    app.registerCommand("recommend", recCmd);

    app.run(); // stops when SocketClientHandler disconnects

    close(clientFd);
    return 0;
}