#ifndef POSTCOMMAND_H
#define POSTCOMMAND_H

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
// PostCommand: Handles the POST command
// Saves a new user and their products ONLY if the user does not already exist
//
// Responses:
//   "201 Created"     — user did not exist, data saved successfully
//   "404 Not Found"   — user already exists, nothing saved
//   "400 Bad Request" — malformed input (no userId or no products)
//====================================================================================================
class PostCommand : public ICommand
{
private:
    IDataStorage &m_storage; // Injected — handles persistence
    IOutputWriter &m_writer; // Injected — handles output destination

public:
    /**
     * Constructor: Both storage and writer are injected
     * PostCommand never knows if it is writing to a socket or stdout
     */
    explicit PostCommand(IDataStorage &storage, IOutputWriter &writer);

    /**
     * execute: Parses args, validates, saves if new user, writes response
     * Silently ignores malformed input by writing "400 Bad Request"
     */
    void execute(std::istringstream &args) override;
    std::string getPrintoutFormat () override;
};

#endif