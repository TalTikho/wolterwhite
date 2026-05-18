#ifndef PATCHCOMMAND_H
#define PATCHCOMMAND_H

//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "ICommand.h"
#include "../output/IOutputWriter.h"
#include "../storage/IDataStorage.h"

// ---- System ----
#include <string>
#include <vector>

//====================================================================================================
// PatchCommand: Handles the PATCH command
// Saves a new user and their products ONLY if the user already exist
//
// Responses:
//   "204 No Content"   — user exists, products successfully added/updated
//   "404 Not Found"    — user does NOT exist in storage (must have been created via POST)
//   "400 Bad Request"  — malformed input (no userId, no productIds, invalid format like tabs, etc.)
//====================================================================================================
class PatchCommand : public ICommand
{
private:
    IDataStorage &m_storage; // Injected — handles persistence
    IOutputWriter &m_writer; // Injected — handles output destination

public:
    /**
     * Constructor: Both storage and writer are injected
     * PatchCommand never knows if it is writing to a socket or stdout
     */
    explicit PatchCommand(IDataStorage &storage, IOutputWriter &writer);

    /**
     * execute: Parses args, validates, saves if existing user, writes response
     * Silently ignores malformed input by writing "400 Bad Request"
     */
    void execute(std::istringstream &args) override;
    const std::string getPrintoutFormat () override;
};

#endif