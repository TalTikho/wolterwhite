#ifndef HELP_COMMAND_H
#define HELP_COMMAND_H

//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "ICommand.h"
#include "../output/IOutputWriter.h" // Added for the writer
#include "../App.h"

//====================================================================================================
// HelpCommand: Responsible for displaying the manual of available commands.
//====================================================================================================
class HelpCommand : public ICommand
{
private:
    IOutputWriter &m_writer; // Injected writer
    App &helpApp;

public:
    /**
     * Constructor: Links the command to an output writer.
     */
    explicit HelpCommand(IOutputWriter &writer, App &app);

    /**
     * Execute: Sends the help message to the writer.
     */
    void execute(std::istringstream &args) override;
    std::string getPrintoutFormat () override;
    
};

#endif