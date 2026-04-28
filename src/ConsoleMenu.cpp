#include "ConsoleMenu.h"
#include <iostream>
#include <sstream>
#include<set>

//The default constructor is empty so we initiallize it using a list.
ConsoleMenu::ConsoleMenu(): allowed{"add", "command", "help" }, next ("")
{

}

void ConsoleMenu::nextSetter(){
    //Read a line from the console using getline().
    std::string line;
    std::getline(std::cin,line);
    /*
    input string stream is getting the line's string as input. 
    We need istringstream to check the first word for a known command.
    */
    std:: istringstream ss (line);
        
    std::string command;
    /*If there is a first word we get it. Using getline we now know it will get the begining of the input
    because there are no more preceding white spaces.*/
    if (ss >> command){
            //Using count we can see if the first word is in our "allowed" set.
            if (allowed.count(command)>0){
                //Get the whole input line for the App to parse.
                this->next = line;
            }          
    }

        return;

    }

std::string ConsoleMenu::nextCommand () noexcept
{
    //Set next privately.
    this->nextSetter();
    //Return the input for App to parse.
    return this->next;
}