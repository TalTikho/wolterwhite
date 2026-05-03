#ifndef ADDPRODUCTCOMMAND_H
#define ADDPRODUCTCOMMAND_H

//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- System ----
#include "ICommand.h"
#include "IDataStorage.h"

//====================================================================================================
// AddProductCommand is the interface for parsing the add command
//====================================================================================================
class AddProductCommand : public ICommand
{
private:
    IDataStorage &m_storage; // A reference to storage so it wont be hardcoded

public:
    /**
     * Constructor: Receives storage by reference so it can be swapped (SOLID)
     * Using explicit to prevent accidental implicit conversions
     */
    explicit AddProductCommand(IDataStorage &storage);

    /**
     * Parses the args stream and saves valid input to storage.
     * Silently ignores:
     *   - Empty input
     *   - Missing product IDs
     *   - Non-numeric input
     * No output on success or failure.
     */
    void execute(std::istringstream &args) override;
};
#endif