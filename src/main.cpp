//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Core App ----
#include "App.h"

// ---- Interfaces ----
#include "IMenu.h"
#include "ICommand.h"
#include "IDataStorage.h"

// ---- Implementations ----
#include "ConsoleMenu.h"
#include "HelpCommand.h"
#include "AddProductCommand.h"
#include "FileDataStorage.h"

// ---- Optional Commands (Not in folder yet) ----
// #include "commands/RecommendCommand.h" 

// ---- System ----
#include <iostream>

/**
 * Main entry point for the Recommender System.
 */
int main() {
    // 1. Initialize the Data Storage with the path to the data file
    // Adjust "data/users_products.txt" to the actual path you use
    FileDataStorage storage("data/data.txt"); 

    // 2. Initialize the Console Menu
    ConsoleMenu menu;

    // 3. Instantiate the Commands
    HelpCommand helpCmd;
    AddProductCommand addCmd(storage); 
    
    // RecommendCommand is still under development by Yotam
    // RecommendCommand recCmd(storage);

    // 4. Setup the Application and Register Commands
    App app(&menu);
    
    app.registerCommand("help", &helpCmd);
    app.registerCommand("add", &addCmd);
    
    // Uncomment this when RecommendCommand.h/cpp are added to the commands folder
    // app.registerCommand("recommend", &recCmd);

    // 5. Run the Application loop
    app.run();

    return 0;
}