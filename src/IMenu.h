#ifndef IMENU_H
#define IMENU_H

#include <string>

//IMenu is the interface defining menu's behavior.

class IMenu{
    public:
        //It is essential to create a default destructor in an interface.
        virtual ~IMenu() = default;
        /*
         The menu object should return a valid command output for the app to use. 
         Of course here the method is virtual.
        */
        virtual std:: string nextCommand() noexcept = 0;
};



#endif