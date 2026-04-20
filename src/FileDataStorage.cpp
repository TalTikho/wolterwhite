//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "FileDataStorage.h"

// ---- System ----
#include <string>
#include <fstream>
#include <sstream>  // To treat a string like a "mini-file" so you can extract data from it (To read ead from and write to a string)
#include <iostream> // To talk to the user

//====================================================================================================
// FileDataStorage.cpp implements FileDataStorage.h
//====================================================================================================
/**
 * Constructor: Uses an "Initializer List" to set the path, 
 * std::move(path) is an optimization- Instead of copying the string, we move it directly into m_filePath
 */
FileDataStorage::FileDataStorage(std::string path) : m_filePath(std::move(path)) {}

/**
 * Save: Appends a line to the file
 */
void FileDataStorage::save(int userId, const std::vector<int> &products)
{
    // std::ios::app opens the file in APPEND mode so we don't overwrite old data
    std::ofstream outFile(m_filePath, std::ios::app);

    if (!outFile)
    {
        std::cerr << "Error: Could not open file for writing: " << m_filePath << std::endl;
        return;
    }

    // Our format: "userId: prodId1 prodId2 ..."
    outFile << userId << ":";
    for (int id : products)
    {
        outFile << " " << id;
    }
    outFile << "\n";

    // File closes automatically when outFile goes out of scope
}

/**
 * LoadAll: Parses the file into the map
 */
std::map<int, std::set<int>> FileDataStorage::loadAll()
{
    std::map<int, std::set<int>> fullData;
    std::ifstream inFile(m_filePath);

    if (!inFile)
    {
        // If the file doesn't exist yet, just return an empty map
        return fullData;
    }

    std::string line;
    while (std::getline(inFile, line))
    {
        if (line.empty())
        {
            continue;
        }

        // Initialize the stringstream by "loading" the current line into it.
        // This treats the string like a mini-file that we can read from sequentially.
        std::stringstream ss(line);

        // Creates an integer 'bucket' to store the User ID.
        // The stream will automatically convert the text digits into a real number.
        int userId;

        // Creates a character 'bucket' to catch and "consume" the colon symbol.
        // We need this so the cursor moves past the ':' and is ready for the products.
        char colon;

        // Extract the userId and skip the colon (Only runs if a number AND a character were successfully found)
        if (ss >> userId >> colon)
        {
            int productId;
            // Extract all remaining integers on that line (This loop keeps going until it runs out of numbers)
            while (ss >> productId)
            {
                fullData[userId].insert(productId);
            }
        }
    }

    return fullData;
}

/*
Felt like an explanation is needed about both of the streams
    - iostream (Input/Output Stream):
        Target: The System Console (Terminal).

        Purpose: To talk to the user.

        Key Tools:

            std::cout: "Character Out" (Prints to the screen).

            std::cin: "Character In" (Reads from the keyboard).

        Analogy: A microphone and a speaker. You speak into it (cin) and it broadcasts to the room (cout).

    - sstream (String Stream):
        Target: A std::string in memory.

        Purpose: To treat a string like a "mini-file" so you can extract data from it.

        Key Tools:

        std::stringstream: Can read from and write to a string.

        Analogy: A digital recorder. You save words into a file (the string), and then you can play them back later to analyze them.
*/