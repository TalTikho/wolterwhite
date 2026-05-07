#ifndef IMENU_H
#define IMENU_H

//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- System ----
#include <string>
#include <sstream>

/**
 * IMenu: The interface defining how the application interacts with the user.
 * It abstracts the source of the input (Keyboard, File, etc.).
 */
class IMenu {
public:
    /**
     * Virtual destructor is essential for proper cleanup of derived classes.
     */
    virtual ~IMenu() = default;

    /**
     * nextCommand: Reads the next line of input from the user.
     * 
     * @param commandName: An output parameter that will store the first word (e.g., "add").
     * @param args: An output stream that will store the rest of the line as arguments.
     * @return: true if a command was successfully read, false if EOF (End of File) was reached.
     */
    virtual bool getNextCommand(std::string &commandName, std::istringstream &args) = 0;
};

#endif