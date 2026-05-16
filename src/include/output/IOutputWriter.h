#ifndef IOUTPUTWRITER_H
#define IOUTPUTWRITER_H

//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- System ----
#include <string>

//====================================================================================================
// IOutputWriter: Abstracts WHERE output is sent
// Allows the same command to write to stdout, a socket, or a test mock
// without any changes to the command itself — Open/Closed Principle
//====================================================================================================
class IOutputWriter
{
public:
    /**
     * Virtual destructor: ensures proper cleanup of derived classes
     */
    virtual ~IOutputWriter() = default;

    /**
     * write: Sends a message to whatever output destination this writer manages
     * Could be stdout, a TCP socket, a test buffer — command doesn't know or care
     */
    virtual void write(const std::string &message) = 0;
};

#endif