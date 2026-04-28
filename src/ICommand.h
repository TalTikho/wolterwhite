#include <iostream>
#include <string>
#include <map>
#include <sstream>

#ifndef ICOMMAND_H
#define ICOMMAND_H

class ICommand{
    public:
        virtual ~ICommand() = default;
        virtual void execute(std::istringstream& args) = 0;
};


#endif