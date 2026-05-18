#ifndef CONSOLECLIENTHANDLER_H
#define CONSOLECLIENTHANDLER_H

//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "ui/IClientHandler.h"
#include "ui/IMenu.h"

//====================================================================================================
// ConsoleClientHandler
//====================================================================================================
class ConsoleClientHandler : public IClientHandler {
private:
    IMenu& m_menu; // injected — actual stdin reader

public:
    explicit ConsoleClientHandler(IMenu& menu);

    // ── IMenu ────────────────────────────────────────────────────────────────
    /**
     * nextCommand: Delegates to injected IMenu
     * Reads one full line from stdin
     */
    std::string nextCommand() noexcept override;

    // ── IOutputWriter ─────────────────────────────────────────────────────────
    /**
     * write: Prints message to stdout
     * Called by App for "400 Bad Request" on unknown commands
     * In Exercise 1 unknown commands are silently ignored
     * so this is rarely called — but exists for interface compliance
     */
    void write(const std::string& message) override;

    // ── IClientHandler ────────────────────────────────────────────────────────
    /**
     * isConnected: Always returns true for console
     * stdin never disconnects — program runs forever
     */
    bool isConnected() override;
};

#endif