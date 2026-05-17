#ifndef APP_H
#define APP_H

//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "ui/IMenu.h"
#include "commands/ICommand.h"
#include "output/IOutputWriter.h" // Added for protocol responses
#include "ICommandProvider.h"

// ---- System ----
#include <map>
#include <string>
#include <sstream>
#include <vector>

//====================================================================================================
// App is the class defining the app's main loop behavior.
//====================================================================================================
class App : public ICommandProvider
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
    4. get_commands: returns App's commands map as a const preserving encapsulation. HelpCommand can then 
       use it to get the commands' print statements. It sees App only as a CommandProvider meaning it can't use App.run().
       However it will be able to use print as it is const.
    */
    void run() noexcept;
    void registerCommand(const std::string &name, ICommand &cmd);
    const std::map<std::string, ICommand*>& get_commands() override;
};

#endif