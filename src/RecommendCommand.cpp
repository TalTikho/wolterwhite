#include "RecommendCommand.h"
#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <iostream>
#include <map>
#include <set>
#include <algorithm>

std::vector<int> RecommendCommand::CommandInfo(std::istringstream &args)
{
    std::vector<int> argsV;
    std:: string arg;
    while (args >> arg){
        try {
            size_t test;
            int ID = std::stoi(arg, &test);
            if (test != arg.size()){
                return;
            }
            if(ID < 0){
                return;
            }
            argsV.push_back(ID);

    }
        catch(...){
            return;
        }
    return argsV;
}
}

RecommendCommand::RecommendCommand(IDataStorage & l) :loader(l)
{
}

void RecommendCommand::execute(std::istringstream & args)
{
    std::vector<int> exec = CommandInfo(args);
    if (exec.size() != 2){
        return;
    }
    int UserID = exec[0];
    int UserProd = exec[1];

    std::map<int, std::set<int>> intel = this->loader.loadAll();
    std:: set<int> UserProducts = intel.at(UserID);
    std:: map<int, int> common;
    std:: map<int, int> pCommon;
    for (int product : UserProducts) 
    {
        for (const auto &[User,pset] : intel) 
        {
            if (User != UserID){
                 common[User] = 0;
                for (const auto prod : pset){
                    if (UserProducts.count(prod)){
                        common[User] += 1;
                    }
                    if (prod != UserProd){
                        pCommon[prod] = 0;
                    }

                }
                for (const auto prod : pset){
                    if (pset.count(UserProd)){
                        pCommon[prod] += common[User];
                    }
                }
                }


            }
            
        }
    std::vector<std::pair<int, int>> sortedProducts(pCommon.begin(), pCommon.end());
    std::sort(sortedProducts.begin(), sortedProducts.end(),
        [](const std::pair<int, int>& a, const std::pair<int, int>& b) {
            if (a.second == b.second){
                return a.first < b.first;
            }
            return a.second < b.second; 
        }
    );
    for (int i = 0; i<10 && i < sortedProducts.size(); i++){
        std::cout<<sortedProducts[i].first<<" ";
    }
    std:: cout<<std::endl;
        
    }

