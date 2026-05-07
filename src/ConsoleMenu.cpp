//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "ConsoleMenu.h"

// ---- System ----
#include <iostream>
#include <string>

/**
 * getNextCommand: Implementation for the standard console input.
 */
bool ConsoleMenu::getNextCommand(std::string &commandName, std::istringstream &args) {
    std::string line;

    // 1. Read the entire line from the user (std::cin)
    if (!std::getline(std::cin, line)) {
        // Return false if EOF reached (like Ctrl+D) or stream error
        return false;
    }

    // Handle empty lines by skipping them or returning a success with empty commandName
    if (line.empty()) {
        commandName = "";
        return true;
    }

    // 2. Use a temporary stream to extract the first word (commandName)
    std::istringstream lineStream(line);
    if (!(lineStream >> commandName)) {
        return true; // Line was just spaces
    }

    // 3. Take the rest of the line and put it into the 'args' stream
    // We get the remaining part of the string starting from the current position of lineStream
    std::string remainingArgs;
    std::getline(lineStream >> std::ws, remainingArgs); // std::ws skips leading whitespace
    
    // Clear the provided 'args' stream and set its content
    args.clear();
    args.str(remainingArgs);

    return true;
}