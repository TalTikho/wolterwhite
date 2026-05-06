#ifndef CONSOLEMENU_H
#define CONSOLEMENU_H

#include "IMenu.h"
#include <string>

//ConsoleMenu is a command line menu version for the project.
class ConsoleMenu: public IMenu{
    private:
        //Set next command using a private setter in order to keep encapsulation.
        void nextSetter();
        std:: string next;
    public:
        explicit ConsoleMenu();
        std:: string nextCommand() noexcept override;
};



#endif
