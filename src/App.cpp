#include "App.h"
#include <map>
#include <sstream>
#include <iostream>
#include <string>
#include <vector>


//App's constructor, the map is not initiallized here but in register_command (this might change afterwards)

App::App(IMenu *m)
{
    this->menu = m;
}

void App::run()
{
    while (true){
        std:: string command = menu->nextCommand();
        //A line only for the tests to break and continue to the next test.
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
        //Try the command and if it exists and the args are valid it works. Else: back to the loop.
        try {
            this->cmds.at(cmd)->execute(ss);
        }
        catch (const std::exception& e){
            continue;
        }
        //App never stops (except when tested).
        continue;



    }
}

void App::registerCommand(std::string name, ICommand& com)
{
    this->cmds[name] = &com;

}
