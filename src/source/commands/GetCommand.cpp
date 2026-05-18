//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "../include/commands/GetCommand.h"

// ---- System ----
#include <map>
#include <set>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm> //Sorting algo template is here.

//====================================================================================================
// RecommendCommand
//====================================================================================================
// To match the constructor
GetCommand::GetCommand(IDataStorage &l, IOutputWriter &w)
    : m_loader(l), m_writer(w) {}

std::vector<std::string> GetCommand::CommandInfo(std::istringstream &args)
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

bool GetCommand::is_num(std::string s)
{
    // stoi returns an int and its length. If the string is an entire number the length (test) should equal the original string's length.
    // Otherwise, it is part number and part string and we return false. We are ok with negative numbers.
    if (s.empty())
        return false;
    try
    {
        size_t test;
        std::stoi(s, &test);
        return test == s.length();
    }
    catch (...)
    {
        return false;
    }
}

void GetCommand::execute(std::istringstream &args)
{
    // Use CommandInfo to get our UserID and products vector.
    std::vector<std::string> argsV = CommandInfo(args);

    // If the vector is other than 2 than we only have a UserID, more than one product or no arguments at all - all invalid.
    //  Validate input: needs exactly [userid] [productid]
    if (argsV.size() != 2)
    {
        // Instead of just returning, tell the user it's a bad request
        m_writer.write("400 Bad Request");
        return;
    }

    // First is UserID, second is the product he viewed.
    std::string userId = argsV[0];
    std::string productId = argsV[1];

    auto data = m_loader.loadAll();

    // We need the entire map of users and products from the filesystem to rank each product.
    // Get the target user's history to filter out products they've already seen
    std::set<std::string> targetUserHistory;
    if (data.count(userId))
    {
        targetUserHistory = data[userId];
    }
    else
    {
        // If user doesn't exist, per protocol we return an empty message
        m_writer.write("");
        return;
    }

    // #2 Commonality of a product = pCommon[Product] = sum of common[User]
    std::map<std::string, int> pCommon;

    // For each UserId != UserId in the data map from all runs, We get his set of viewed products
    for (auto const &[user, products] : data)
    {
        // Skip the target user themselves
        if (user == userId)
            continue;

        // Check if this "other user" viewed the seed product
        if (products.count(productId))
        {
            for (const std::string &p : products)
            {
                // HISTORY FILTER:
                //  - Don't recommend the seed product (p != productId)
                //  - Don't recommend what the target user has already seen (targetUserHistory.count == 0)
                if (p != productId && targetUserHistory.find(p) == targetUserHistory.end())
                {
                    pCommon[p]++;
                }
            }
        }
    }

    std::vector<std::pair<std::string, int>> sortedProducts(pCommon.begin(), pCommon.end());

    std::sort(sortedProducts.begin(), sortedProducts.end(),
              [this](const std::pair<std::string, int> &a, const std::pair<std::string, int> &b)
              {
                  // Primary Sort: By Score (Highest to Lowest)
                  if (a.second != b.second)
                  {
                      return a.second > b.second;
                  }

                  // Secondary Sort: Tie-breaking by ID
                  // If both are numeric, sort numerically: 100 < 103 < 109
                  if (is_num(a.first) && is_num(b.first))
                  {
                      return std::stoi(a.first) < std::stoi(b.first);
                  }

                  // Fallback: Lexicographical sort for non-numeric IDs
                  return a.first < b.first;
              });

    // Build the result string
    std::string result;
    int printed = 0;
    for (size_t i = 0; printed < 10 && i < sortedProducts.size(); ++i)
    {
        if (!result.empty())
            result += " ";
        result += sortedProducts[i].first;
        printed++;
    }

    // Send the final filtered list to the client
    m_writer.write(result);
}
