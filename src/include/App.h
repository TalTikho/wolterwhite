#ifndef APP_H
#define APP_H

//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "ui/IMenu.h"
#include "commands/ICommand.h"
#include "output/IOutputWriter.h" // Added for protocol responses

// ---- System ----
#include <map>
#include <string>
#include <sstream>

//====================================================================================================
// App is the class defining the app's main loop behavior.
//====================================================================================================
class App
{
private:
    IMenu *menu;
    std::map<std::string, ICommand *> cmds;
    IOutputWriter *m_defaultWriter; // To handle unknown command responses

public:
    // Updated to take a default writer for system-level responses
    explicit App(IMenu *m, IOutputWriter *defaultWriter);

    /*
    1. constructor.
    2. run is the app loop.
    3. register command enters a command into the app. Will possible be entered into the constructor later.
    */
    void run() noexcept;
    void registerCommand(const std::string &name, ICommand &cmd);
};

#endif