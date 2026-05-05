//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "AddProductCommand.h"

//====================================================================================================
// AddProductCommand.cpp implements AddProductCommand.h
//====================================================================================================

/**
 * Constructor: Stores reference to storage interface
 */
AddProductCommand::AddProductCommand(IDataStorage& storage) 
    : m_storage(storage) {}

/**
 * Execute: Parses args and saves to storage
 * Format expected: "[userid] [pid1] [pid2] ..."
 * 
 * Rules:
 * - All tokens must be numeric integers — if ANY token is non-numeric, 
 *   the entire line is rejected silently
 * - At least one product ID must exist
 * - Multiple spaces between tokens are handled automatically by >>
 * - No output on success or failure (silent)
 * 
 * Flow:
 * 1. Try to read userId    — if fails, silently return
 * 2. Read remaining tokens — if ANY is non-numeric, silently return
 * 3. Check at least one product exists — if not, silently return
 * 4. Save to storage
 */
void AddProductCommand::execute(std::istringstream& args) {

    // Reading the userId 
    // If stream is empty or first token is non-numeric, fail silently
    int userId;
    if (!(args >> userId)) {
        return; // Handles: empty input "", "wrong input"
    }

    // Reading and validating all remaining tokens 
    // We read as strings first so we can fully validate each token
    // before committing to saving anything
    std::vector<int> products;
    std::string token;

    while (args >> token) {
        // Try to parse the token as a full integer
        // std::stoi converts string to int, pos tells us how many characters were consumed
        try {
            size_t pos;
            int productId = std::stoi(token, &pos);

            // pos must equal token.size() —> if not, the token was only
            // partially numeric (e.g. "101abc" -> stoi reads 101 but stops at 'a')
            // We reject the ENTIRE line in this case
            if (pos != token.size()) {
                return; // Handles: "1 101abc 102" ->? reject whole line
            }

            // std::stoi will handle neg numbers so we need check the productId
            if(productId < 0){
                return; // Handle "1 -101" -> reject whole line
            }

            products.push_back(productId);

        } catch (...) {
            // stoi throws if the token doesn't start with a digit at all
            // e.g. "gibberish", "abc", "!@#"
            // Reject the entire line silently
            return; // Handles: "1 101 gibberish" -> reject whole line (test 6)
        }
    }

    // Checking at least one product was found
    // A valid add command requires: userId + at least one productId
    // If products is empty, the line was just "1" with nothing after it
    if (products.empty()) {
        return; // Handles: "1" with no products
    }

    // All tokens valid — save to storage
    // IDataStorage::save handles duplicates internally via set
    // No output on success — silent by design
    m_storage.save(userId, products);
}