//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "FileDataStorage.h"

// ---- System ----
#include <string>
#include <fstream>
#include <sstream>
#include <iostream>
#include <utility>

/**
 * Constructor: Initializes the storage with a specific file path.
 */
FileDataStorage::FileDataStorage(std::string path) : m_filePath(std::move(path)) {}

/**
 * Save: Adds a new record of a user and their products to the end of the file.
 */
void FileDataStorage::save(const std::string &userId, const std::vector<std::string> &products)
{
    // Open the file in "append" mode so we add to the end instead of erasing existing data
    std::ofstream outFile(m_filePath, std::ios::app);

    // If the file fails to open, tell the user there was an error and stop
    if (!outFile)
    {
        std::cerr << "Error: Could not open file for writing: " << m_filePath << std::endl;
        return;
    }

    // Write the User ID followed by a colon to start the line
    outFile << userId << ":";

    // Loop through each product in the list and write it to the file with a space in front
    for (const std::string& id : products)
    {
        outFile << " " << id;
    }

    // Add a new line at the end so the next save starts on a fresh line
    outFile << "\n";
}

/**
 * LoadAll: Reads the entire file from the disk and builds a map of data in memory.
 */
std::map<std::string, std::set<std::string>> FileDataStorage::loadAll()
{
    // Create an empty map to hold our users and their sets of unique products
    std::map<std::string, std::set<std::string>> fullData;

    // Open the file for reading
    std::ifstream inFile(m_filePath);

    // If the file doesn't exist yet, simply return the empty map and finish
    if (!inFile)
    {
        return fullData;
    }

    std::string line;
    // Read the file line by line until we reach the very end
    while (std::getline(inFile, line))
    {
        // If we encounter an empty line, skip it and move to the next one
        if (line.empty())
        {
            continue;
        }

        // Put the current line into a stringstream so we can extract pieces of data from it
        std::stringstream ss(line);

        std::string userId;

        // Try to extract the User ID and the colon character from the start of the line
        if (std::getline(ss, userId, ':'))
        {
            std::string productId;
            // Keep reading every word (product ID) that follows on the same line
            while (ss >> productId)
            {
                // Insert the product into the set for this specific user (duplicates are ignored)
                fullData[userId].insert(productId);
            }
        }
    }

    // Return the completed map containing all the data from the file
    return fullData;
}