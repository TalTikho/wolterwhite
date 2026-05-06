#ifndef CONSOLEMENU_H
#define CONSOLEMENU_H

//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "IMenu.h"

// ---- System ----
#include <string>
#include <sstream>

/**
 * ConsoleMenu: A concrete implementation of IMenu for standard I/O (Terminal).
 */
class ConsoleMenu : public IMenu {
public:
    /**
     * Default constructor.
     */
    explicit ConsoleMenu() = default;

    /**
     * getNextCommand: Reads a line from std::cin and splits it.
     * 
     * @param commandName: Will contain the first word (e.g., "add").
     * @param args: Will contain the rest of the line as a stream.
     * @return: true if input was read, false if EOF (Ctrl+D).
     */
    bool getNextCommand(std::string &commandName, std::istringstream &args) override;
};

#endif