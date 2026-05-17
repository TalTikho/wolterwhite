#ifndef ICLIENTHANDLER_H
#define ICLIENTHANDLER_H

//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "ui/IMenu.h"
#include "output/IOutputWriter.h"

//====================================================================================================
// IClientHandler: Combines IMenu + IOutputWriter into one interface
//====================================================================================================
class IClientHandler : public IMenu, public IOutputWriter
{
public:
    /**
     * Virtual destructor: ensures proper cleanup of derived classes
     */
    virtual ~IClientHandler() = default;

    /**
     * isConnected: Returns true if client is still active
     * false when TCP client closes connection
     * App::run() uses this to know when to stop the loop
     */
    virtual bool isConnected() = 0;

    // IMenu provides:
    //   virtual std::string nextCommand() noexcept = 0;

    // IOutputWriter provides:
    //   virtual void write(const std::string& message) = 0;
};

#endif