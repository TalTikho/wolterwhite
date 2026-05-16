// src/include/AllIncludes.h
#pragma once

// Commands
#include "commands/ICommand.h"
#include "commands/PostCommand.h"
#include "commands/HelpCommand.h"
#include "commands/RecommendCommand.h"
// #include "commands/AddProductCommand.h"

// Output
#include "output/SocketWriter.h"
#include "output/ConsoleWriter.h"
#include "output/IOutputWriter.h"

// Storage
#include "storage/IDataStorage.h"
#include "storage/FileDataStorage.h"

// UI
#include "ui/IMenu.h"
#include "ui/ConsoleMenu.h"

// App
#include "App.h"