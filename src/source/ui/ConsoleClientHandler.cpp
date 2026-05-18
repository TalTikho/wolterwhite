#include "ui/ConsoleClientHandler.h"
#include <iostream>

ConsoleClientHandler::ConsoleClientHandler(IMenu& menu)
    : m_menu(menu) {}

std::string ConsoleClientHandler::nextCommand() noexcept {
    // Delegate to injected menu — reads from stdin
    return m_menu.nextCommand();
}

void ConsoleClientHandler::write(const std::string& message) {
    // Print to stdout — satisfies IOutputWriter
    std::cout << message << "\n";
}

bool ConsoleClientHandler::isConnected() {
    // Console never disconnects
    return true;
}