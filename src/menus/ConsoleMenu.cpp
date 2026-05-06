#include "ConsoleMenu.h"
#include <iostream>
#include <sstream>
#include<set>

//The default constructor is empty so we initiallize it using a list.
ConsoleMenu::ConsoleMenu():  next ("")
{

}

//nextSetter is here to keep encapsulation.
void ConsoleMenu::nextSetter(){
    //Make sure next is an empty string even if we had a good previous command.
    this->next = "";
    //Read a line from the console using getline().
    std::string line;
    std::getline(std::cin,line);
    this->next = line;
    return;

    }

std::string ConsoleMenu::nextCommand () noexcept
{
    //Set next privately.
    this->nextSetter();
    //Return the input for App to parse.
    return this->next;
}