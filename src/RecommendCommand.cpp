#include "RecommendCommand.h"
//System includes
#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <iostream>
#include <map>
#include <set>
//Sorting algo template is here.
#include <algorithm>


std::vector<std::string> RecommendCommand::CommandInfo(std::istringstream &args)
{
    //Using the stringStream input to parse the user input into a string vector to make execute easier.
    std::vector<std::string> argsV;
    //Dummy vector to return if something fails.
    std::vector<std::string> argsDummy;
    std:: string arg;
    //Try getting each part of the input excluding ws into a string vector. StringStream does the heavy lifting here.
    while (args >> arg){
        try {
            argsV.push_back(arg);

    }
        catch(...){
            return argsDummy;
        }
    
    
    
}
    return argsV;
}

bool RecommendCommand::is_num(std::string s)
{
    //stoi returns an int and its length. If the string is an entire number the length (test) should equal the original string's length.
    //Otherwise, it is part number and part string and we return false. We are ok with negative numbers.
        try {
            size_t test;
            int ID = std::stoi(s, &test);
            if (test != s.size()){
                return false;
            }
            return true;

    }
        catch(...){
            return false;
        }
}


RecommendCommand::RecommendCommand(IDataStorage & l) :loader(l)
{
}

void RecommendCommand::execute(std::istringstream & args) 
{
    //Use CommandInfo to get our UserID and products vector.
    std::vector<std::string> exec = CommandInfo(args);
    //If the vector is other than 2 than we only have a UserID, more than one product or no arguments at all - all invalid.
    if (exec.size() != 2){
        return;
    }
    //First is UserID, second is the product he viewed.
    std::string UserID = exec[0];
    std::string UserProd = exec[1];
    bool found = false;

    //We need the entire map of users and products from the filesystem to rank each product.
    std::map<std::string, std::set<std::string>> intel = this->loader.loadAll();
    //Check if user exists so we do not throw an exception by default through map.
    for (const auto &[User,pset]: intel){
        if (User == UserID){
            found = true;
        }
    }
    if (found == false){
        return;
    }
    //User's products vector, essential to ranking.
    std:: set<std::string> UserProducts = intel.at(UserID);
    //#1 Commonality of a user = common[User] =  |same products as exec[0]|
    std:: map<std::string, int> common;
    //#2 Commonality of a product = pCommon[Product] = sum of common[User]
    std:: map<std::string, int> pCommon;

    //For each UserId != UserId in the data map from all runs, We get his set of viewed products.
    for (const auto &[User,pset] : intel) 
    {
        
        if (User != UserID){
            //rank is first 0.
                common[User] = 0;
            for (const auto& prod : pset){
                //according to #1: If we find the product in the user's set in UserId's set it is a common product 
                if (UserProducts.count(prod)){
                    common[User] += 1;
                }

            }
            //Now we rank products according to #2.
            for (const auto& prod : pset){
                if (pset.count(UserProd) && UserProducts.count(prod)==0){
                    pCommon[prod] += common[User];
                }
            }
            }


        }
        /*Delete all of the products our user has already viewed from the recommendation map.
         Although they are zeroed out due to a previous condition becuase zero is not a recommendation*/
        for (auto it = pCommon.begin(); it != pCommon.end();){
            if (UserProducts.count(it->first)){
                it = pCommon.erase(it);
            }
            else{
                it++;
            }
        }

            
        // }

        //We need a vector of a pair in order for us to sort our ranked products.
        //We are using the sorting template for vector pairs from algorithm.
            
    std::vector<std::pair<std::string, int>> sortedProducts(pCommon.begin(), pCommon.end());
    std::sort(sortedProducts.begin(), sortedProducts.end(),
    //We must have access to this for us to access private methods is_num and to_int.
        [this](const std::pair<std::string, int>& a, const std::pair<std::string, int>& b) {
            //If it is a num and two are equal we return based on the smaller productID. Otherwise we first convert by ascii value.
            if (!is_num(a.first) || !is_num(b.first)){
                if (a.second == b.second){
                    return a.first < b.first;
                } 

            }
            if (is_num(a.first) && is_num(b.first)){
                if (a.second == b.second){
                    return std::stoi (a.first) < std::stoi (b.first);
                }
                return a.second > b.second; 
            }
            return a.second > b.second; 
            
        }
    );
    //Print up to 10 products. We have a condition that i < sortedProducts and print "" if the pair list is empty.
    //The printed var decouples products size and the 10 items limit.
    int printed = 0;
    if (sortedProducts.size() == 0) {std:: cout << "";};
    for (size_t i = 0; printed<10 && i < sortedProducts.size(); i++){
        if (sortedProducts[i].first != UserProd && sortedProducts[i].second != 0){
            std::cout<<sortedProducts[i].first<<" ";
            printed++;
        }
    }
    std:: cout<<std::endl;
        
    }

