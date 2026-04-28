#ifndef CONSOLEMENU_H
#define CONSOLEMENU_H

#include "IMenu.h"
#include <string>
#include <set>

class ConsoleMenu: public IMenu{
    private:
        //Store a set of allowed commands to see if in inputed command is valid.
        const std::set<std::string> allowed;
        //Set next command using a private setter in order to keep encapsulation.
        void nextSetter();
        std:: string next;
    public:
        explicit ConsoleMenu();
        std:: string nextCommand() noexcept override;
};



#endif
