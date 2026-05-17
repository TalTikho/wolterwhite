#ifndef ICOMMANDPROVIDER_H
#define ICOMMANDPROVIDER_H


/**
 * ICommand: The blueprint for all possible user actions (add, recommend, help).
 * Every command class must implement this interface.
 */
class ICommandProvider {
private:
    std::map<std::string, ICommand *> cmds;
public:
    virtual const std::map<std::string, ICommand*>& get_commands() = 0;
};

#endif