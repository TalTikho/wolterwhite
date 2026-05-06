//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "HelpCommand.h"

// ---- System ----
#include <iostream>
#include <string>

/**
 * Execute: Prints the manual only if no extra arguments were provided.
 */
void HelpCommand::execute(std::istringstream& args) {
    
    // Create a temporary string to check if there is any "leftover" text in the stream
    std::string extra;
    
    // Try to read one more word from the stream. 
    // If we succeed, it means the user typed something like "help dsh", which is invalid.
    if (args >> extra) {
        // We stop here and print nothing, effectively ignoring the invalid command
        return;
    }

    // If we reached this point, the stream was empty or contained only spaces.
    // Now we print the exact help message required by the project
    std::cout << "add [userid] [productid1] [productid2]..." << std::endl;
    std::cout << "recommend [userid] [productid]" << std::endl;
    std::cout << "help" << std::endl;
}