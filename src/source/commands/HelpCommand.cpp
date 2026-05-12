//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "../include/commands/HelpCommand.h"

// ---- System ----
#include <string>

//====================================================================================================
/**
 * Constructor: Stores the reference to the writer.
 */
HelpCommand::HelpCommand(IOutputWriter &writer) : m_writer(writer) {}

/**
 * Execute: Sends the manual via the writer instead of using cout.
 */
void HelpCommand::execute(std::istringstream &args)
{
    std::string extra;
    if (args >> extra)
        return; // Requirement: ignore if extra args exist

    // Use the writer instead of std::cout
    m_writer.write("POST [userid] [productid1] [productid2]...");
    m_writer.write("recommend [userid] [productid]");
    m_writer.write("help");
}