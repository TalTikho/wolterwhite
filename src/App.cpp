#include "App.h"
#include <map>
#include <sstream>
#include <iostream>
#include <string>
#include <vector>


/*Use std method to check if a string is a number 
 so we get either numbers or empty input after a valid command's name.
 This standart method checks the ASCII value of chars to match digits' ASCII.
 Here we go over the string as a chars array to check each char.
*/
bool App::is_number(std::string s)
{
    if (s.empty()){
        return false;
    }
    for (size_t i = 0; i < s.size(); i++){
        if (!std:: isdigit(s[i])){
            return false;
        }
    }
    return true;
}

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
        //Command was not in menu's or otherwise inserted App's map hence we look for another input.
        if (!(cmds.count(cmd)>0)){
            continue;
        }
        /*If the input is a command without arguments ss has reached eof and we can command.execute().
         As we do not need arguments what is in ss does not matter anymore, just what is in cmd.
        */
        if (ss.eof()){
            this->cmds[cmd]->execute(ss);
            continue;
        }
        //We do not want the leftover whitespace after the valid command accepted into the command's method.
        ss >> std:: ws;
        //clear errors
        ss.clear();
        //Save the position for the command to use its args stream later.
        std::stringstream::pos_type pos = ss.tellg();
        //Get all the remaining strings/possible args and check if they are all in digit form.
        while (ss>>cache){
            if (!this->is_number(cache)){
                break;
            }
        }
        //eof means all of the stream was proccessed succefully and no break was called in the above while loop.
        if (ss.eof()){
            //Clear error, go back to the position after the command's name we saved earlier.
            ss.clear();
            ss.seekg(pos);
            this->cmds[cmd]->execute(ss);
        }
        //App never stops (except when tested).
        continue;



    }
}

void App::registerCommand(std::string name, ICommand& com)
{
    this->cmds[name] = &com;

}
