#ifndef ICOMMANDPROVIDER_H
#define ICOMMANDPROVIDER_H

#include <map>
#include <string>

// Forward declaration so the compiler knows ICommand exists
class ICommand;
/**
 * ICommandProvider: so App can send help a map safely.
 */
class ICommandProvider {
public:
    virtual const std::map<std::string, ICommand*>& get_commands() = 0;
};

#endif