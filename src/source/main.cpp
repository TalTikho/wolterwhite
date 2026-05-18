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

    // All commands MUST take the writer now
    // AddProductCommand addCmd(storage, cw);
    GetCommand get(storage, writer);
    PostCommand post(storage, writer);

    // Inject the writer into the App so it can report "400 Bad Request"
    App app(&menu, &writer);
    HelpCommand helpCmd(writer, app);
    app.registerCommand("help", helpCmd);
    app.registerCommand("recommend", get);
    app.registerCommand("post", post);
    HelpCommand help(writer, app); // Constructor injection

    app.run(); // stops when SocketClientHandler disconnects

    close(clientFd);
    return 0;
}