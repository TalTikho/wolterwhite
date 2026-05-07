#ifndef HELP_COMMAND_H
#define HELP_COMMAND_H

//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "ICommand.h"

/**
 * HelpCommand: Responsible for displaying the manual of available commands to the user.
 * This class handles the 'help' command.
 */
class HelpCommand : public ICommand {
public:
    /**
     * Execute: Prints the predefined help message to the console.
     * 
     * Following the project requirements:
     * - It ignores any extra arguments provided after the 'help' keyword.
     * - It prints a specific list of commands in a strict format.
     * 
     * @param args: The stream containing any text typed after 'help' (which will be ignored).
     */
    void execute(std::istringstream& args) override;
};

#endif