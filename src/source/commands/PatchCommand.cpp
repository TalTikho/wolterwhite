//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "../include/commands/PatchCommand.h"

// ---- System ----
#include <string>
#include <vector>
#include <sstream>

//====================================================================================================
// PatchCommand.cpp implements PatchCommand.h
//====================================================================================================
/**
 * Constructor: Stores references to injected storage and writer
 */
PatchCommand::PatchCommand(IDataStorage &storage, IOutputWriter &writer)
    : m_storage(storage), m_writer(writer) {}

/**
 * execute: Main Patch logic
 *
 * Flow:
 * 1. Parse userId  — if missing → "400 Bad Request"
 * 2. Parse products — if none   → "400 Bad Request"
 * 3. Check if user already exists in storage
 *    — if no → "404 Not Found"
 * 4. Save data → "204 No Content"
 */
void PatchCommand::execute(std::istringstream &args)
{
    // Check for tabs
    std::string originalStr = args.str();
    if (originalStr.find('\t') != std::string::npos)
    {
        m_writer.write("400 Bad Request");
        return;
    }

    std::string userId;

    // Check if userId exists. If not, it's a 400 Bad Request.
    if (!(args >> userId))
    {
        m_writer.write("400 Bad Request");
        return;
    }

    // Capture products into a vector
    std::vector<std::string> newProducts;
    std::string pid;
    while (args >> pid)
    {
        newProducts.push_back(pid);
    }

    // If a userId was provided but no product IDs followed, return 400 Bad Request.
    if (newProducts.empty())
    {
        m_writer.write("400 Bad Request");
        return;
    }

    // Load current data to check for duplicates
    auto allData = m_storage.loadAll();

    // If user does not exist, return 404 Not Found
    auto userIt = allData.find(userId);
    if (userIt == allData.end())
    {
        m_writer.write("404 Not Found");
        return;
    }

    // Append new products using insert (sets automatically handle duplicates)
    auto existingProducts = userIt->second;
    for (const auto &newPid : newProducts)
    {
        existingProducts.insert(newPid);
    }
    
    // Convert std::set back to std::vector for storage compliance
    std::vector<std::string> updatedVector(existingProducts.begin(), existingProducts.end());

    // Save and return success
    m_storage.save(userId, updatedVector);
    m_writer.write("204 No Content");
}

//Patch printing format for usage in HelpCommand.
const std::string PatchCommand::getPrintoutFormat()
{
    return "PATCH, arguments: [userid] [productid1] [productid2] ...\n";
}