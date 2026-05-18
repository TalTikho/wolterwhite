//====================================================================================================
// Include all needed headers
//====================================================================================================

// ---- Files ----
#include "../../include/commands/HelpCommand.h"
#include "../include/commands/ICommandProvider.h"

// ---- System ----
#include <string>

//====================================================================================================
// Constructor
// Stores references to:
// 1. The output writer used to send responses
// 2. The command provider used to access all registered commands
//====================================================================================================
HelpCommand::HelpCommand(IOutputWriter &writer, ICommandProvider &com)
    : m_writer(writer), m_commandProvider(com)
{
}

//====================================================================================================
// Execute
// Prints all available commands in alphabetical order.
//
// Behavior:
// - If extra arguments are provided -> ignore request
// - If tabs are detected -> return "400 Bad Request"
// - Prints all commands except "help"
// - Prints "help" last
//====================================================================================================
void HelpCommand::execute(std::istringstream &args)
{
    std::string extra;

    // Ignore execution if extra arguments exist
    if (args >> extra)
    {
        m_writer.write("400 Bad Request");
        return;
    }

    // Reject tab characters according to project requirements
    std::string originalStr = args.str();

    if (originalStr.find('\t') != std::string::npos)
    {
        m_writer.write("400 Bad Request");
        return;
    }

    // Get all registered commands from the provider
    const std::map<std::string, ICommand*> &commands =
        m_commandProvider.get_commands();

    // Iterate through commands in alphabetical order
    // (std::map keeps keys sorted automatically)
    for (const auto &pair : commands)
    {
        const std::string &commandName = pair.first;
        ICommand *command = pair.second;

        // Print all commands except "help"
        // so "help" can always appear last
        if (command != nullptr && commandName != "help")
        {
            m_writer.write(command->getPrintoutFormat());
        }
    }

    // Print help command last
    m_writer.write(getPrintoutFormat());
}

//====================================================================================================
// Returns the help command print format
//====================================================================================================
const std::string HelpCommand::getPrintoutFormat()
{
    return "help\n";
}