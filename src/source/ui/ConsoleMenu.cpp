#include "../include/ui/ConsoleMenu.h"
#include <iostream>

ConsoleMenu::ConsoleMenu() = default;

std::string ConsoleMenu::nextCommand() noexcept {
    std::string line;
    std::getline(std::cin, line);
    return line;
}