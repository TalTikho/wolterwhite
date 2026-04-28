#ifndef FILEDATASTORAGE_H
#define FILEDATASTORAGE_H

//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "IDataStorage.h"

// ---- System ----
#include <map>
#include <set>
#include <string>
#include <vector>

//====================================================================================================
// FileDataStorage.h implements the interface
//====================================================================================================
/**
 * FileDataStorage Implementation
 * This class handles the actual reading/writing to a physical .txt file.
 */
class FileDataStorage : public IDataStorage
{
private:
    std::string m_filePath; // Member variable to store the path to avoid hardcodding

public:
    /**
     * Constructor: Takes the path to the database file.
     * Using 'explicit' to prevent accidental type conversions.
     */
    explicit FileDataStorage(std::string path);

    /**
     * Appends a new line of data to the file.
     * format: userId: prodId1 prodId2 ...
     */
    void save(int userId, const std::vector<int> &products) override;

    /**
     * Reads the entire file and builds the map in memory.
     */
    std::map<int, std::set<int>> loadAll() override;
};
#endif