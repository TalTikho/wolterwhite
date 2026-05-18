#ifndef CONSOLEMENU_H
#define CONSOLEMENU_H

#include "IMenu.h"
#include <string>

// ConsoleMenu is a command-line implementation of IMenu.
// It reads user input from stdin and returns it as a raw command string.
class ConsoleMenu : public IMenu {
public:
    ConsoleMenu();
    std::string nextCommand() noexcept override;
};

#endif