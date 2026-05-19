# ====================================================================================================================
# WOLTERWHITE PROJECT CONFIGURATION
# ====================================================================================================================

# Minimum version of CMake required to run this script
cmake_minimum_required(VERSION 3.17)

# Project name and language (CXX stands for C++)
project(wolterwhite CXX)

# Use C++17 standard (required for modern features like std::filesystem)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# --------------------------------------------------------------------------------------------------------------------
# 1. CORE LOGIC LIBRARY (The "Brain" of the project)
# We group all our functional code into a static library. This makes it easy to 
# share the exact same code between the main application and the test suite.
# --------------------------------------------------------------------------------------------------------------------
add_library(project_logic STATIC
    # Main Application Controller
    src/source/App.cpp
    src/include/App.h

    # Abstract Interfaces (The Blueprints/Contracts)
    src/include/commands/ICommand.h
    src/include/ui/IMenu.h
    src/include/storage/IDataStorage.h

    # Command Implemedntations (The Actions)
    src/source/commands/HelpCommand.cpp
    src/include/commands/HelpCommand.h
    src/source/commands/GetCommand.cpp
    src/include/commands/GetCommand.h

    # User Interface Logic
    src/source/ui/ConsoleMenu.cpp
    src/include/ui/ConsoleMenu.h

    # Data Persistence Logic
    src/source/storage/FileDataStorage.cpp
    src/include/storage/FileDataStorage.h

    # OUTPUT
    src/include/output/IOutputWriter.h
    src/include/output/ConsoleWriter.h
    src/include/output/SocketWriter.h

    # POST
    src/source/commands/PostCommand.cpp
    src/include/commands/PostCommand.h


    #Helping HelpCommand Inject 
    src/include/commands/ICommandProvider.h
    # Handlers
    src/source/ui/ConsoleClientHandler.cpp
    src/include/ui/ConsoleClientHandler.h
    src/source/ui/SocketClientHandler.cpp
    src/include/ui/SocketClientHandler.h
    src/include/ui/IClientHandler.h

    src/source/server/TCPServer.cpp
    src/include/server/TCPServer.h

    src/source/commands/DeleteCommand.cpp
    src/source/commands/PatchCommand.cpp   
)

# --------------------------------------------------------------------------------------------------------------------
# 2. HEADER SEARCH PATHS
# These paths tell the compiler where to look for .h files.
# 'PUBLIC' ensures that any code linking to 'project_logic' (like our tests) 
# also knows where to find these headers automatically.
# --------------------------------------------------------------------------------------------------------------------
target_include_directories(project_logic PUBLIC 
    src/include
)

# --------------------------------------------------------------------------------------------------------------------
# 3. COMPILER SETTINGS
# PRIVATE flags here help catch bugs early by enabling strict warnings during compilation.
# -Wall: Basic warnings, -Wextra: Extra warnings, -Wpedantic: Strictly follow C++ standard.
# --------------------------------------------------------------------------------------------------------------------
target_compile_options(project_logic PRIVATE -Wall -Wextra -Wpedantic)

# --------------------------------------------------------------------------------------------------------------------
# 4. MAIN EXECUTABLE (The actual program)
# Creates the final 'wolterwhite' binary using main.cpp as the entry point.
# --------------------------------------------------------------------------------------------------------------------
add_executable(wolterwhite src/source/main.cpp)

# Link our core library ('project_logic') into the final executable.
target_link_libraries(wolterwhite PRIVATE project_logic)

# --------------------------------------------------------------------------------------------------------------------
# 5. ASSET MANAGEMENT
# Copies the 'data' folder to the build directory so the program can access 
# files (like products.txt) during runtime.
# --------------------------------------------------------------------------------------------------------------------
file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/data DESTINATION ${CMAKE_CURRENT_BINARY_DIR})

# --------------------------------------------------------------------------------------------------------------------
# 6. TESTING SUITE (CTest)
# Enables the testing engine and tells CMake to look into the 'tests' folder 
# for more configuration files.
# --------------------------------------------------------------------------------------------------------------------
#enable_testing()
add_subdirectory(tests)