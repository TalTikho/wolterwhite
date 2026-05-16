//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "../include/commands/PostCommand.h"

// ---- System ----
#include <string>
#include <vector>
#include <sstream>

//====================================================================================================
// PostCommand.cpp implements PostCommand.h
//====================================================================================================
/**
 * Constructor: Stores references to injected storage and writer
 */
PostCommand::PostCommand(IDataStorage &storage, IOutputWriter &writer)
    : m_storage(storage), m_writer(writer) {}

/**
 * execute: Main POST logic
 *
 * Flow:
 * 1. Parse userId  — if missing → "400 Bad Request"
 * 2. Parse products — if none   → "400 Bad Request"
 * 3. Check if user already exists in storage
 *    — if yes → "404 Not Found"
 * 4. Save data → "201 Created"
 */
void PostCommand::execute(std::istringstream &args)
{
    std::string userId;

    // Check if userId exists. If not, it's a 400 Bad Request.
    if (!(args >> userId))
    {
        m_writer.write("400 Bad Request");
        return;
    }

    // Capture products into a vector
    std::vector<std::string> products;
    std::string pid;
    while (args >> pid)
    {
        products.push_back(pid);
    }

    // If a userId was provided but no product IDs followed,
    // it's an invalid POST request — return 400 Bad Request.
    if (products.empty())
    {
        m_writer.write("400 Bad Request");
        return;
    }

    // Load current data to check for duplicates
    auto allData = m_storage.loadAll();

    // If user exists, return 404 Not Found
    if (allData.find(userId) != allData.end())
    {
        m_writer.write("404 Not Found");
        return;
    }

    // Save and return success
    m_storage.save(userId, products);
    m_writer.write("201 Created");
}