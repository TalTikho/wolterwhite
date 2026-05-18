#ifndef SOCKETWRITER_H
#define SOCKETWRITER_H
//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "IOutputWriter.h"

// ---- System ----
#include <string>
#include <sys/socket.h>

//====================================================================================================
// SocketWriter - to write using socket
//====================================================================================================
class SocketWriter : public IOutputWriter
{
private:
    int m_socketFd; // the file descriptor of the connected client socket

public:
    explicit SocketWriter(int socketFd) : m_socketFd(socketFd) {}

    void write(const std::string &message) override
    {
        std::string toSend = message + "\n"; // assignment requires newline at end
        send(m_socketFd, toSend.c_str(), toSend.size(), 0);
    }
};

#endif