//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "../include/storage/FileDataStorage.h"

// ---- System ----
#include <string>
#include <fstream>
#include <sstream>
#include <iostream>
#include <utility>
#include <map>
#include <set>
#include <vector>

/**
 * Constructor: Initializes the storage with a specific file path.
 */
FileDataStorage::FileDataStorage(std::string path) : m_filePath(std::move(path)) {}

/**
 * Save: Adds a new record of a user and their products to the end of the file.
 */
void FileDataStorage::save(const std::string &userId, const std::vector<std::string> &products)
{
    /*Load all user->products data from to the file into a map using FileDataStorage loadAll.
     If the file is empty then an empty map is loaded so loadAll usage is not faulty.
     Important to do this before deleting the entire file's contents.
    */
    std::map<std::string, std::set<std::string>> All = this->loadAll();
    // If there are no products leave no garbage.
    if (products.empty())
    {
        All[userId].clear();
    }
    else
    {
    // 2. Now insert into a fresh, empty set
        for (const std::string &p : products)
        {
            All[userId].insert(p);
        }
    }
    /*delete the file's content so we can update it in a way each user has its own line
     as one cannot simply find a string in the file and append to it from there.
    */
    std::ofstream of(m_filePath, std::ofstream::out| std::ofstream::trunc);
    // If the file fails to open, tell the user there was an error and stop
    if (!of)
    {
        std::cerr << "Error: Could not open file for writing: " << m_filePath << std::endl;
        return;
    }
    // Write the entire map into the file. This takes longer than adding one user
    // to the end of the file each time. However it makes sure every user has one line only.
    for (auto &[user, products] : All)
    {
        // Write the User ID followed by a colon to start the line
        of << user << ":";
        for (const std::string &p : products)
        {
            of << " " << p;
        }
        // Add a new line at the end so the next save starts on a fresh line
        of << "\n";
    }
    of.close();
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
            // No products == still user.
            if (fullData.find(userId) == fullData.end())
            {
                fullData[userId] = std::set<std::string>();
            }
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