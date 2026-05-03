#ifndef APP_H
#define APP_H

#include "IMenu.h"
#include "ICommand.h"
#include <sstream>
#include <map>
#include <string>

//App is the interface defining App's behavior.

class App{
    private:
        IMenu* menu;
        std:: map <std:: string, ICommand*> cmds;

    public:
        explicit App(IMenu* m);
        /*
        1. constructor.
        2. run is the app loop.
        3. register command enters a command into the app. Will possible be entered into the constructor later.
        */
        void run();
        void registerCommand (std::string name, ICommand& com);
};



#endif
