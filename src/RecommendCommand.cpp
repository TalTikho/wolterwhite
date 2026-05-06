#include "RecommendCommand.h"
#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <iostream>
#include <map>
#include <set>
#include <algorithm>


std::vector<std::string> RecommendCommand::CommandInfo(std::istringstream &args)
{
    std::vector<std::string> argsV;
    std:: string arg;
    while (args >> arg){
        try {
            argsV.push_back(arg);

    }
        catch(...){
            return;
        }
    return argsV;
}
}

bool RecommendCommand::is_num(std::string s)
{
        try {
            size_t test;
            int ID = std::stoi(s, &test);
            if (test != s.size()){
                return false;
            }
            if(ID < 0){
                return false;
            }
            return true;

    }
        catch(...){
            return;
        }
}

int RecommendCommand::to_int(std::string s)
{
    int sum = 0;
    for (char c: s){
        int ascii = static_cast<int>(c);
        sum += ascii;
    }
    return sum;
}

RecommendCommand::RecommendCommand(IDataStorage & l) :loader(l)
{
}

void RecommendCommand::execute(std::istringstream & args)
{
    std::vector<std::string> exec = CommandInfo(args);
    if (exec.size() != 2){
        return;
    }
    std::string UserID = exec[0];
    std::string UserProd = exec[1];

    std::map<std::string, std::set<std::string>> intel = this->loader.loadAll();
    std:: set<std::string> UserProducts = intel.at(UserID);
    std:: map<std::string, int> common;
    std:: map<std::string, int> pCommon;
    for (std::string product : UserProducts) 
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
    std::vector<std::pair<std::string, std::string>> sortedProducts(pCommon.begin(), pCommon.end());
    std::sort(sortedProducts.begin(), sortedProducts.end(),
        [this](const std::pair<std::string, std::string>& a, const std::pair<std::string, std::string>& b) {
            if (!is_num(a.second) || !is_num(b.second)){
                if (to_int(a.second) == to_int(b.second)){
                    return a.first < b.first;
                }
                return to_int(a.second) < to_int(b.second);

            }
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

