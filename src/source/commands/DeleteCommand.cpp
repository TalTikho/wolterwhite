#include "../include/commands/DeleteCommand.h"
#include "DeleteCommand.h"
#include <map>
#include <set>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>

DeleteCommand::DeleteCommand(IDataStorage &storage, IOutputWriter &writer): d_storage(storage), d_writer(writer){}
std::vector<std::string> DeleteCommand::CommandInfo(std::istringstream &args)
{
    // Using the stringStream input to parse the user input into a string vector to make execute easier.
    std::vector<std::string> argsV;
    std::string arg;

    // Try getting each part of the input excluding ws into a string vector. StringStream does the heavy lifting here.
    while (args >> arg)
    {
        argsV.push_back(arg);
    }
    return argsV;
}
void DeleteCommand::execute(std::istringstream &args)
{
    std::vector<std::string> items  = CommandInfo(args);
    std::string userId = items[0];
    std::map<std::string, std::set<std::string>>  all = this->d_storage.loadAll();
    if (items.size() < 2 || !(std::find(all.begin(), all.end(), userId) != all.end())){
        this->d_writer.write("400 Bad Request");
        return;
    }
    bool NoValidP = true;
     for (const std::string product : items){
        if (std::find(all.begin(), all.end(), product) != all.end()){
            NoValidP = false;
            continue;
        }
     }
     if (NoValidP){
        this->d_writer.write("400 Bad Request");
        return;
     }
     std::set<std::string> products_to_delete;
     std::string temp;
     args >> temp;
     while (args >> temp){
        products_to_delete.insert(temp);
     }
     for (auto const product : products_to_delete){

        if (std::find(all.begin(), all.end(), product) != all.end()){
            all[userId].erase(product);
        }
     }
     auto updated = all[userId];
     
    std::vector<std::string> newProdList(updated.begin(), updated.end());

     this->d_storage.save(userId, newProdList);


}
const std::string DeleteCommand::getPrintoutFormat()
{
    return "DELETE, arguments: [userid] [productid1] [productid2] ...\n";
}
