#include <iostream>
#include <string>
#include <sstream>
#include <vector>

#include "ICommand.h"
#include "IDataStorage.h"

#ifndef RecommendCommand_H
#define RecommendCommand_H

class RecommendCommand: public ICommand{
    private:
        std:: vector <std::string> CommandInfo (std::istringstream& args);
        IDataStorage& loader;
        bool is_num(std::string s);
        int to_int (std::string s);

    public:
        explicit RecommendCommand(IDataStorage& l);
        void execute(std::istringstream& args) override;
};


#endif