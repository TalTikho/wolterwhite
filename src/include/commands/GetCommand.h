#ifndef RecommendCommand_H
#define RecommendCommand_H

//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "ICommand.h"
#include "../storage/IDataStorage.h"
#include "../output/IOutputWriter.h"

// ---- System ----
#include <string>
#include <vector>
#include <sstream>

//====================================================================================================
// Recommend
//====================================================================================================
class GetCommand : public ICommand
{
    /**
     * CommandInfo: private function that returns a string vector to use in the command's execute.
     *
     * @param args: The stream of args input into recommend in app which is based on the user's string input.
     * @return: String vector for execute to use.
     */
private:
    IDataStorage &m_loader;
    IOutputWriter &m_writer; // Injected writer

    std::vector<std::string> CommandInfo(std::istringstream &args);

    // Check if a string is fully converitble to a number
    bool is_num(std::string s);

public:
    // Updated constructor to accept the writer
    explicit GetCommand(IDataStorage &l, IOutputWriter &w);

    /**
     * execute: recommend a user up to 10 products based on a product he viewed.
     *
     * @param args: The stream of args input into recommend in app which is based on the user's string input.
     * @return: Void as the recommendation is printed. (outputs via m_writer instead of std::cout.)
     */
    void execute(std::istringstream &args) override;
};

#endif