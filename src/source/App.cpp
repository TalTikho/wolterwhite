//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "../include/App.h"
#include "../include/ui/IClientHandler.h"

// ---- System ----
#include <map>
#include <string>
#include <sstream>
#include <iostream>
#include "App.h"

//====================================================================================================
/*App's constructor, the map is not initiallized here but in register_command (this might change afterwards)
 We have a general menu accepted here as any class implementing IMenu can be this private variable.
*/
App::App(IMenu *m, IOutputWriter *defaultWriter) : menu(m), m_defaultWriter(defaultWriter) {}

void App::run() noexcept
{
    if (this->cmds.count("help")) {
        std::istringstream empty;
        this->cmds.at("help")->execute(empty);
    }

    // Check if menu is also an IClientHandler
    // If yes -> use isConnected() to stop loop when client disconnects
    // If no  -> nullptr → while(true) behavior unchanged
    IClientHandler* clientHandler = dynamic_cast<IClientHandler*>(menu);

    while (true)
    {
        // Stop loop when socket client disconnects
        if (clientHandler && !clientHandler->isConnected()) {
            break;
        }

        std::string input = menu->nextCommand();

        if (input.empty()) continue;

        std::istringstream ss(input);
        std::string cmdName;
        if (!(ss >> cmdName)) continue;

        if (cmdName == "quit" || cmdName == "QUIT")
            break;

        if (input.find('\t') != std::string::npos)
            continue;

        ss >> std::ws;

        if (this->cmds.count(cmdName))
        {
            try
            {
                this->cmds.at(cmdName)->execute(ss);
            }
            catch (...)
            {
                if (m_defaultWriter)
                    m_defaultWriter->write("400 Bad Request");
            }
        }
        else
        {
            if (m_defaultWriter)
                m_defaultWriter->write("400 Bad Request");
        }
    }
}

void App::registerCommand(const std::string &name, ICommand &cmd)
{
    this->cmds[name] = &cmd;
}

const std::map<std::string, ICommand *> &App::get_commands()
{
    return this->cmds;
}
