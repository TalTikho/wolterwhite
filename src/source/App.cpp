//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "../include/App.h"

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
    // Professional touch: Trigger help automatically on start as per Ex1/Ex2 requirements
    if (this->cmds.count("help")) {
        std::istringstream empty;
        this->cmds.at("help")->execute(empty);
    }

    while (true)
    {
        std::string input = menu->nextCommand();

        // 1. Check for empty first
        if (input.empty()) continue;

        // 2. Use a stream to extract the first word. 
        // This ignores leading/trailing whitespace or \r automatically.
        std::istringstream ss(input);
        std::string cmdName;
        if (!(ss >> cmdName)) continue;

        // 3. NOW check for quit. This is much safer than input == "quit"
        if (cmdName == "quit")
            break;

        // 4. Requirement check: Tab restriction
        if (input.find('\t') != std::string::npos)
            continue;

        // Clean up whitespace for the command arguments
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
            // If we are here, it's definitely not 'quit' and not a known command
            if (m_defaultWriter)
                m_defaultWriter->write("400 Bad Request");
        }
    }
}

/*Add a new command to the app. If it exists run will tell the command to execute.
 Otherwise: the execution fails and we continue run's loop. */
void App::registerCommand(const std::string &name, ICommand &cmd)
{
    this->cmds[name] = &cmd;
}

const std::map<std::string, ICommand *> &App::get_commands() const
{
    return this->cmds;
}
