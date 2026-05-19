#include "server/TCPServer.h"
#include <iostream>
#include <unistd.h>
#include <stdexcept>
#include <cstring>

TCPServer::TCPServer(int port) : m_port(port), m_serverFd(-1), m_address{} {}

TCPServer::~TCPServer() {
    stop();
}

void TCPServer::start() {
    // 1. Create a modern TCP IPv4 socket stream
    m_serverFd = socket(AF_INET, SOCK_STREAM, 0);
    if (m_serverFd < 0) {
        throw std::runtime_error("Failed to create server socket: " + std::string(strerror(errno)));
    }

    // 🎯 FIX: Allow immediate reuse of local addresses/ports.
    // This prevents "Address already in use" crashes during rapid integration test reruns.
    int opt = 1;
    if (setsockopt(m_serverFd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt)) < 0) {
        throw std::runtime_error("Failed to set SO_REUSEADDR: " + std::string(strerror(errno)));
    }

    // 2. Clear and set up address structures
    m_address.sin_family = AF_INET;
    m_address.sin_addr.s_addr = INADDR_ANY; // Bind to all interfaces (essential for Docker routing)
    m_address.sin_port = htons(m_port);

    // 3. Bind to specified port
    if (bind(m_serverFd, (struct sockaddr*)&m_address, sizeof(m_address)) < 0) {
        close(m_serverFd);
        m_serverFd = -1;
        throw std::runtime_error("Failed to bind socket to port " + std::to_string(m_port) + ": " + std::string(strerror(errno)));
    }

    // 4. Start listening (Backlog of 10 connections)
    if (listen(m_serverFd, 10) < 0) {
        close(m_serverFd);
        m_serverFd = -1;
        throw std::runtime_error("Failed to listen on socket: " + std::string(strerror(errno)));
    }

    std::cout << "Server listening on port " << m_port << std::endl;
}

int TCPServer::acceptClient() {
    if (m_serverFd < 0) {
        throw std::runtime_error("Cannot accept client: Server is not started.");
    }

    struct sockaddr_in clientAddress{};
    socklen_t clientAddrLen = sizeof(clientAddress);

    // This blocks until a client (or your test client) executes connect()
    int clientFd = accept(m_serverFd, (struct sockaddr*)&clientAddress, &clientAddrLen);
    if (clientFd < 0) {
        throw std::runtime_error("Failed to accept incoming client connection: " + std::string(strerror(errno)));
    }

    std::cout << "Client connected" << std::endl;
    return clientFd;
}

void TCPServer::stop() {
    if (m_serverFd >= 0) {
        close(m_serverFd);
        m_serverFd = -1;
    }
}