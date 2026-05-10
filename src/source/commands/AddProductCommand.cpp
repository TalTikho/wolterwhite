//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "../include/commands/AddProductCommand.h"
#include <string>
#include <vector>

/**
 * Constructor: Connects the command to the existing storage system.
 */
AddProductCommand::AddProductCommand(IDataStorage& storage) 
    : m_storage(storage) {}

/**
 * Execute: Reads the user's input and attempts to save it to the database.
 * The expected format is: "add [userId] [productId1] [productId2] ..."
 */
void AddProductCommand::execute(std::istringstream& args) {

    // First, try to extract the User ID from the start of the command
    std::string userId;
    
    // If the first thing after 'add' isn't a valid number, stop immediately without a word
    if (!(args >> userId)) {
        return; 
    }

    // Prepare a list to hold the product IDs we find
    std::vector<std::string> products;
    std::string productToken;

    // Keep reading every word that follows on the same line
    // The '>>' operator automatically handles multiple spaces
    while (args >> productToken) {
        // Add the product string to our list
        products.push_back(productToken);
    }

    // According to the rules, we need at least one product ID to proceed
    // If the user only typed "add 1" and nothing else, we ignore the command
    if (products.empty()) {
        return; 
    }

    // Now that we have a valid User ID and at least one product, save it to storage
    // The storage system will handle updating the files and ignoring duplicate products
    m_storage.save(userId, products);
}