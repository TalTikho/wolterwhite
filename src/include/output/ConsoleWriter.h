#ifndef CONSOLEWRITER_H
#define CONSOLEWRITER_H

//====================================================================================================
// Include all needed headers
//====================================================================================================
// ---- Files ----
#include "IOutputWriter.h"

// ---- System ----
#include <iostream>

//====================================================================================================
// ConsoleWriter - to write to the console
//====================================================================================================
class ConsoleWriter : public IOutputWriter
{
public:
    void write(const std::string &message) override
    {
        std::cout << message << "\n";
    }
};

#endif