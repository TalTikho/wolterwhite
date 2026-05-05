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
        std:: vector <int> CommandInfo (std::istringstream& args);
        IDataStorage& loader;

    public:
        explicit RecommendCommand(IDataStorage& l);
        void execute(std::istringstream& args) override;
};


#endif