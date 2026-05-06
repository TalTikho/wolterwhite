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
    std:: string arg;
    //Try getting each part of the input excluding ws into a string vector. StringStream does the heavy lifting here.
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
            return;
        }
}

int RecommendCommand::to_int(std::string s)
{
    //If we do not have an entire int we do a static_cast into an int to get the ascii val for each char and sum them up. 
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
    //Use CommandInfo to get our UserID and products vector.
    std::vector<std::string> exec = CommandInfo(args);
    //If the vector is other than 2 than we only have a UserID, more than one product or no arguments at all - all invalid.
    if (exec.size() != 2){
        return;
    }
    //First is UserID, second is the product he viewed.
    std::string UserID = exec[0];
    std::string UserProd = exec[1];

    //We need the entire map of users and products from the filesystem to rank each product.
    std::map<std::string, std::set<std::string>> intel = this->loader.loadAll();
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
            for (const auto prod : pset){
                //If we find the product in the user's set in UserId's set it is a common product so according to #1:
                if (UserProducts.count(prod)){
                    common[User] += 1;
                }

            }
            //Now we rank products according to #2.
            for (const auto prod : pset){
                if (pset.count(UserProd)){
                    pCommon[prod] += common[User];
                }
            }
            }


        }

        //We need a vector of a pair in order for us to sort our ranked products.
        //We are using the sorting template for vector pairs from algorithm.
            
    std::vector<std::pair<std::string, std::string>> sortedProducts(pCommon.begin(), pCommon.end());
    std::sort(sortedProducts.begin(), sortedProducts.end(),
    //We must have access to this for us to access private methods is_num and to_int.
        [this](const std::pair<std::string, std::string>& a, const std::pair<std::string, std::string>& b) {
            //If it is a num and two are equal we return based on the smaller productID. Otherwise we first convert by ascii value.
            if (!is_num(a.first) || !is_num(b.first)){
                if (to_int(a.second) == to_int(b.second)){
                    return to_int(a.first) < to_int(b.first);
                } 

            }
            if (a.second == b.second){
                return a.first < b.first;
            }
            return a.second < b.second; 
        }
    );
    //Print up to 10 products. We have a condition that i < sortedProducts and print "" if the pair list is empty.
    if (sortedProducts.size() == 0) {std:: cout << "";};
    for (int i = 0; i<10 && i < sortedProducts.size(); i++){
        std::cout<<sortedProducts[i].first<<" ";
    }
    std:: cout<<std::endl;
        
    }

