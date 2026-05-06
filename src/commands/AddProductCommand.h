#ifndef ADDPRODUCTCOMMAND_H
#define ADDPRODUCTCOMMAND_H

//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "ICommand.h"
#include "IDataStorage.h"

/**
 * AddProductCommand: Responsible for taking user input and saving it to the database.
 * This class handles the "add [userid] [productid1] [productid2] ..." command.
 */
class AddProductCommand : public ICommand
{
private:
    /**
     * A reference to the storage system. 
     * We use a reference to the Interface (IDataStorage) so this command doesn't 
     * care if we are saving to a file, a database, or memory.
     */
    IDataStorage &m_storage;

public:
    /**
     * Constructor: Links the command to a storage system.
     * 
     * @param storage: The storage engine to use for saving data.
     * We use 'explicit' to ensure the compiler doesn't perform unexpected type conversions.
     */
    explicit AddProductCommand(IDataStorage &storage);

    /**
     * Execute: Reads the user's input, extracts the User ID and Product IDs, 
     * and sends them to the storage system.
     * 
     * Following the project requirements:
     * - It extracts one User ID (integer).
     * - It extracts a list of Product IDs (strings).
     * - If the input is invalid or missing data, it stops silently without printing errors.
     * 
     * @param args: The stream containing everything the user typed after the word 'add'.
     */
    void execute(std::istringstream &args) override;
};
#endif