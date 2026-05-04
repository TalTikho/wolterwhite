#include "App.h"
#include <map>
#include <sstream>
#include <iostream>
#include <string>
#include <vector>


/*App's constructor, the map is not initiallized here but in register_command (this might change afterwards)
 We have a general menu accepted here as any class implementing IMenu can be this private variable.
*/

App::App(IMenu *m)
{
    this->menu = m;
}

void App::run() noexcept
{
    while (true){
        std:: string command = menu->nextCommand();
        //A line only for the tests to break the loop and continue to the next test.
        if (command == "quit"){
            break;
        }
        //Do not accept tabs.
        if (command.find('\t') != std::string:: npos ){
            continue;
        }
        //Start a stream to validate the input sent to the command.
        std:: istringstream ss(command);
        std :: string cmd;
        std:: string cache;
        ss >> cmd;
        //We do not want the leftover whitespace after the valid command accepted into the command's method.
        ss >> std:: ws;
        /*Try the command and if it exists and the args are valid it works. Else: back to the loop
         Even if there is an error we just continue the loop with the next query for the next command.
         .at(cmd) will make sure that if cmd is not in our cmds map a null pointer will not be created, 
         there is no segfault and the loop goes on with catch's continue.
         */
        try {
            this->cmds.at(cmd)->execute(ss);
        }
        catch (...){
            continue;
        }
        //App never stops (except when tested).
        continue;



    }
}

/*Add a new command to the app. If it exists run will tell the command to execute.
 Otherwise: the execution fails and we continue run's loop. */
void App::registerCommand(std::string name, ICommand& com)
{
    this->cmds[name] = &com;

}
