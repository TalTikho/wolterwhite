//System includes
#include <iostream>
#include <string>
#include <sstream>
#include <vector>

//Aggregation and Inheritence includes
#include "ICommand.h"
#include "IDataStorage.h"

#ifndef RecommendCommand_H
#define RecommendCommand_H

class RecommendCommand: public ICommand{
            /**
     * CommandInfo: private function that returns a string vector to use in the command's execute.
     * 
     * @param args: The stream of args input into recommend in app which is based on the user's string input.
     * @return: String vector for execute to use.
     */
    private:
        std:: vector <std::string> CommandInfo (std::istringstream& args);
        IDataStorage& loader;
        //check if a string is fully converitble to a number.
        bool is_num(std::string s);


    public:
        explicit RecommendCommand(IDataStorage& l);
            /**
     * execute: recommend a user up to 10 products based on a product he viewed.
     * 
     * @param args: The stream of args input into recommend in app which is based on the user's string input.
     * @return: Void as the recommendation is printed.
     */
        void execute(std::istringstream& args) override;
};


#endif