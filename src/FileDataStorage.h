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
class FileDataStorage : public IDataStorage
{
private:
    std::string m_filePath;

public:
    /**
     * Constructor: Takes the path to the database file.
     */
    explicit FileDataStorage(std::string path);

    /**
     * Appends a new line of data to the file.
     * format: userId: prodId1 prodId2 ...
     */
    void save(const std::string &userId, const std::vector<std::string> &products) override;

    /**
     * Reads the entire file and builds the map in memory.
     */
    std::map<std::string, std::set<std::string>> loadAll() override;
};
#endif