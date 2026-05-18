#include "../include/commands/DeleteCommand.h"
#include "DeleteCommand.h"
#include <map>
#include <set>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>

DeleteCommand::DeleteCommand(IDataStorage &storage, IOutputWriter &writer): m_storage(storage), m_writer(writer){}
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
    //No tabs
    std::string findTabs = args.str();
    if (findTabs.find('\t') != std::string::npos)
    {
        m_writer.write("400 Bad Request");
        return;
    }
    std::vector<std::string> items  = CommandInfo(args);
    //The first string inputed should be the user.
    std::string userId = items[0];
    //Load the map to be able to handle data.
    std::map<std::string, std::set<std::string>>  all = this->m_storage.loadAll();
    //Delete should have at least two args: [userid] [productid1]. The user should exist hence in the loadAll map.
    if (items.size() < 2 || !(std::find(all.begin(), all.end(), userId) != all.end())){
        this->m_writer.write("400 Bad Request");
        return;
    }
     //The first arg is items is the userId while the rest are the supposed products.
     std::set<std::string> products_to_delete;
     for (int i = 1; i < items.size(); i++){
        products_to_delete.insert(items[i]);
     }
     //Delete every product in the user's set in map from our map's copy. Smart for loop and iterator are in usage here.
     for (auto const product : products_to_delete){

        if (std::find(all[userId].begin(), all[userId].end(), product) != all[userId].end()){
            all[userId].erase(product);
        }
        //Product not found so "404 Not Found"".
        else{
            this->m_writer.write("404 Not Found");
        return;

        }
     }

     //Get the curret set from our map's copy.
     auto updated = all[userId];
     
     //Iterate to get updated into a vector so we can save the new set.
    std::vector<std::string> newProdList(updated.begin(), updated.end());

    //Save the new set.
     this->m_storage.save(userId, newProdList);
     //All is good "200 OK"
     this->m_writer.write("200 OK");
     return;


}
//Delete's print format for usage in helpCommand.
const std::string DeleteCommand::getPrintoutFormat()
{
    return "DELETE, arguments: [userid] [productid1] [productid2] ...\n";
}
