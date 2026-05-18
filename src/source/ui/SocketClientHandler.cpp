//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "ui/SocketClientHandler.h"

// ---- System ----
#include <sys/socket.h>
#include <string>

//====================================================================================================
// Socket handler
//====================================================================================================
SocketClientHandler::SocketClientHandler(int socketFd)
    : m_socketFd(socketFd), m_connected(true) {}

std::string SocketClientHandler::nextCommand() noexcept
{
    std::string line;
    char ch;

    // Read one character at a time until \n
    while (true)
    {
        int bytesRead = recv(m_socketFd, &ch, 1, 0);

        if (bytesRead <= 0)
        {
            // 0  = client disconnected cleanly
            // <0 = socket error
            m_connected = false;
            return "";
        }

        if (ch == '\n')
        {
            return line; // return without \n
        }

        line += ch;
    }
}

void SocketClientHandler::write(const std::string &message)
{
    // We nned to end every message with \n
    std::string toSend = message + "\n";
    send(m_socketFd, toSend.c_str(), toSend.size(), 0);
}

bool SocketClientHandler::isConnected()
{
    return m_connected;
}