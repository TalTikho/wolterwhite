#ifndef DELETECOMMAND_H
#define DELETECOMMAND_H

//====================================================================================================
// Include all needed headers
//====================================================================================================
#include "ICommand.h"
#include "../output/IOutputWriter.h"
#include "../storage/IDataStorage.h"


// DeleteCommand is is responsible for deleting viewed items id's from a user id's view list.
class DeleteCommand : public ICommand
{
private:
    IDataStorage &d_storage; // Injected — handles persistence
    IOutputWriter &d_writer; // Injected — handles output destination

public:
    /**
     * Constructor: Both storage and writer are injected
     * DeleteCommand can write to the console or to a socket, it does not matter
     * The writing gives indications on the delete-action status.
     */
    explicit DeleteCommand(IDataStorage &storage, IOutputWriter &writer);
    std::vector<std::string>CommandInfo(std::istringstream &args);

    /**
     * execute: Parses args, validates, deletes if the user and the products both exist. The it writes a response
     * indicating its task's status.
     * Silently ignores malformed input by writing "400 Bad Request"
     */
    void execute(std::istringstream &args) override;
    const std::string getPrintoutFormat () override;
};

#endif