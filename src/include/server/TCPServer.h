#ifndef TCPSERVER_H
#define TCPSERVER_H

#include <sys/socket.h>
#include <netinet/in.h>

class TCPServer {
private:
    int m_port;
    int m_serverFd;
    struct sockaddr_in m_address;

public:
    explicit TCPServer(int port);
    ~TCPServer();

    // Prevent copying to avoid multiple objects managing the same socket FD
    TCPServer(const TCPServer&) = delete;
    TCPServer& operator=(const TCPServer&) = delete;

    void start();
    int acceptClient();
    void stop();
};

#endif // TCPSERVER_H