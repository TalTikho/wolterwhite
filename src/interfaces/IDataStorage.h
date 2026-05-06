#ifndef IDATASTORAGE_H
#define IDATASTORAGE_H

//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- System ----
#include <map>
#include <set>
#include <string>
#include <vector>

//====================================================================================================
// IDataStorage.h is the interface that defines what storage will do
//====================================================================================================
class IDataStorage
{
public:
    /**
     * Virtual destructor: Essential in C++ to ensure child classes are cleaned up properly
     */
    virtual ~IDataStorage() = default;

    /**
     * Saves products for a specific user.
     * products are now stored as strings.
     */
    virtual void save(int userId, const std::vector<std::string> &products) = 0;

    /**
     * Loads the entire database into memory.
     * Key: UserId (int)
     * Value: Set of ProductIds (string)
     */
    virtual std::map<int, std::set<std::string>> loadAll() = 0;
};
#endif