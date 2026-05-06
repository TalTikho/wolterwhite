#ifndef ICOMMAND_H
#define ICOMMAND_H

#include <sstream>

/**
 * ICommand: The blueprint for all possible user actions (add, recommend, help).
 * Every command class must implement this interface.
 */
class ICommand {
public:
    /**
     * Virtual destructor: Ensures that when a command is finished, 
     * its memory is cleaned up correctly from the system.
     */
    virtual ~ICommand() = default;

    /**
     * Execute: This is the primary function that runs the command's logic.
     * 
     * @param args: A stream containing the extra data the user typed 
     * (like user IDs or product names). We pass it as a stream so each 
     * command can extract exactly what it needs.
     */
    virtual void execute(std::istringstream& args) = 0;
};

#endif