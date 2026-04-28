#ifndef IDATASTORAGE_H
#define IDATASTORAGE_H

//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- System ----
#include <map>
#include <set>
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
    virtual ~IDataStorage() = default; // Like an empty body

    /**
     * Saves products for a specific user.
     * Using 'const std::vector<int>&' to pass by reference (faster than copying in Java).
     */
    virtual void save(int userId, const std::vector<int> &products) = 0; // = 0 is the equivalent of abstract in java

    /**
     * Loads the entire database into memory.
     * Key: UserId (int)
     * Value: Set of ProductIds (set ensures no duplicates for the recommendation engine)
     */
    virtual std::map<int, std::set<int>> loadAll() = 0;
};
#endif