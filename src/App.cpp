//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "App.h"

// ---- System ----
#include <iostream>
#include <string>
#include <sstream>

/**
 * Constructor: Initializes the app with a menu implementation.
 */
App::App(IMenu *m) : m_menu(m) {}

/**
 * registerCommand: Maps a string name to a specific command object.
 */
void App::registerCommand(const std::string& name, ICommand* com) {
    if (com) {
        this->m_commands[name] = com;
    }
}

/**
 * run: The main application loop.
 */
void App::run() noexcept {
    std::string cmdName;
    std::istringstream cmdArgs;

    // The loop continues as long as getNextCommand returns true (no EOF)
    while (m_menu->getNextCommand(cmdName, cmdArgs)) {
        
        // 1. Handling the "quit" command for tests/graceful exit
        if (cmdName == "quit") {
            break;
        }

        // 2. Skip empty inputs (like just pressing Enter)
        if (cmdName.empty()) {
            continue;
        }

        /* 3. Execute logic:
           We use 'find' instead of 'at' or '[]' to safely check if the command exists.
           - 'at' throws an exception (which is fine since we have catch, but 'find' is cleaner).
           - '[]' might create a null entry if the key doesn't exist.
        */
        auto it = m_commands.find(cmdName);
        if (it != m_commands.end()) {
            try {
                // Execute the command with the stream already prepared by the menu
                it->second->execute(cmdArgs);
            }
            catch (...) {
                // If anything goes wrong inside the command, we ignore and continue
                continue;
            }
        }
        // If command is not found, we simply ignore it
    }
}