#ifndef SOCKETCLIENTHANDLER_H
#define SOCKETCLIENTHANDLER_H

//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "ui/IClientHandler.h"

//====================================================================================================
// SocketClientHandler:
//
// Implements IMenu:
//   nextCommand() -> reads one line from TCP socket
//
// Implements IOutputWriter:
//   write() -> sends message + \n over TCP socket
//
// Implements IClientHandler:
//   isConnected() -> false when client disconnects
//
// Both input and output use the SAME socket fd
// This reflects the reality of TCP — one connection, two directions
//
// Usage in main.cpp:
//   SocketClientHandler handler(clientFd);
//   App app(&handler, &handler); // satisfies both IMenu* and IOutputWriter*
//====================================================================================================
class SocketClientHandler : public IClientHandler
{
private:
    int m_socketFd;   // connected client socket fd
    bool m_connected; // false when client disconnects

public:
    explicit SocketClientHandler(int socketFd);

    // ── IMenu ────────────────────────────────────────────────────────────────
    /**
     * nextCommand: Reads one full line from TCP socket
     * Reads character by character until \n received
     * Returns line without the \n
     * Sets m_connected=false and returns "" on disconnect
     */
    std::string nextCommand() noexcept override;

    // ── IOutputWriter ─────────────────────────────────────────────────────────
    /**
     * write: Sends message + \n over TCP socket
     * Assignment requires every response ends with \n
     * Called by App for "400 Bad Request"
     * Called by commands for their specific responses
     */
    void write(const std::string &message) override;

    // ── IClientHandler ────────────────────────────────────────────────────────
    /**
     * isConnected: Returns false when client has disconnected
     * App::run() checks this to exit the loop cleanly
     */
    bool isConnected() override;
};

#endif