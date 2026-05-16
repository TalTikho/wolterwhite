//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "../include/AllIncludes.h"

//====================================================================================================
int main()
{
    FileDataStorage storage("data/data.txt");
    ConsoleMenu menu;
    ConsoleWriter cw; // One writer shared by everyone

    // All commands MUST take the writer now
    HelpCommand helpCmd(cw);
    // AddProductCommand addCmd(storage, cw);
    RecommendCommand rec(storage, cw);
    PostCommand post(storage, cw);

    // Inject the writer into the App so it can report "400 Bad Request"
    App app(&menu, &cw);

    app.registerCommand("help", helpCmd);
    // app.registerCommand("add", addCmd);
    app.registerCommand("recommend", rec);
    app.registerCommand("POST", post);

    app.run();
    return 0;
}