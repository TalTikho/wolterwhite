#ifndef APP_H
#define APP_H

//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "IMenu.h"
#include "ICommand.h"

// ---- System ----
#include <map>
#include <string>

/**
 * App: Manages the application lifecycle and command execution.
 */
class App {
private:
    IMenu* m_menu;                                    // Pointer to the menu interface
    std::map<std::string, ICommand*> m_commands;     // Map linking strings (e.g., "add") to command objects

public:
    /**
     * Constructor: Receives the menu implementation.
     */
    explicit App(IMenu* m);

    /**
     * registerCommand: Adds a command to the application's dictionary.
     * @param name: The string trigger (e.g., "help").
     * @param com: Pointer to the command object.
     */
    void registerCommand(const std::string& name, ICommand* com);

    /**
     * run: The main execution loop of the application.
     */
    void run() noexcept;
};

#endif