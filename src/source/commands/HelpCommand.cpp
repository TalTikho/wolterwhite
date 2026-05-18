//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "../../include/commands/HelpCommand.h"
#include "../include/commands/ICommandProvider.h"

// ---- System ----
#include <string>

//====================================================================================================
/**
 * Constructor: Stores the reference to the writer. And a command provider.
 */

HelpCommand::HelpCommand(IOutputWriter &writer, ICommandProvider &com): m_writer(writer), helpCom(com){}

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
//Help printing format for usage in HelpCommand.
const std::string HelpCommand::getPrintoutFormat()
{
    return "help\n";
}