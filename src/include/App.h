#ifndef APP_H
#define APP_H

#include "ui/IMenu.h"
#include "commands/ICommand.h"
#include <sstream>
#include <map>
#include <string>

//App is the class defining the app's main loop behavior.

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
        void run() noexcept;
        void registerCommand (std::string name, ICommand& com);
};



#endif