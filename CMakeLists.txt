#====================================================================================================================
# Cmake for the whole work
#====================================================================================================================

# Defines the minimum version of CMake required for the features used in this project
cmake_minimum_required(VERSION 3.17)

# Sets the project name and specifies that we are using the C++ (CXX) language
project(wolterwhite CXX)

# Sets the C++ standard to 17 (needed for std::filesystem used in your storage logic)
set(CMAKE_CXX_STANDARD 17)

# Ensures that the compiler MUST support C++17 or it will stop and throw an error
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Creates a static library called 'project_logic' containing all your functional classes.
# This prevents duplicate compilation and allows the App and Tests to share the same code.
add_library(project_logic STATIC
    # TODO: Remove the comment when the file is created (notice that even interfaces should be here)
    
    # ---- App ----
    #src/App.cpp

    # ---- Help ----
    #src/HelpCommand.cpp

    # ---- AddProduct ----
    src/AddProductCommand.cpp

    # ---- ConsoleMenu ----
    src/ConsoleMenu.cpp

    # ---- UserProductMap ----
    #src/UserProductMap.cpp

    # ---- FileDataStorage ----
    src/FileDataStorage.cpp

    # ---- RecommandEngine ----
    #src/RecommendEngine.cpp

    # ---- RelevanceRanker ----
    #src/RelevanceRanker.cpp

    # ---- SimilarityScorer ----
    #src/SimilarityScorer.cpp

    # ---- RecommendCommand ----
    #src/RecommendCommand.cpp

)

# Tells CMake that the 'src' directory contains our header (.h) files.
# 'PUBLIC' means that anything linking to this library (like your tests) automatically gets this include path.
target_include_directories(project_logic PUBLIC src)

# Enables strict compiler warnings for the library to catch potential bugs (uninitialized variables, etc.)
target_compile_options(project_logic PRIVATE -Wall -Wextra -Wpedantic)

# Creates the final executable 'wolterwhite' from your main entry point file (MAIN APP)
add_executable(wolterwhite src/main.cpp)

# Links the executable to our 'project_logic' library so it can access all our classes/commands
target_link_libraries(wolterwhite PRIVATE project_logic)

# Copies the 'data' folder from your source directory to the build directory.
# This ensures that your storage class can find the database files during runtime.
file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/data DESTINATION ${CMAKE_CURRENT_BINARY_DIR})


# Enables the CMake testing engine (CTest) for the entire project (TESTS)
enable_testing()

# Tells CMake to enter the 'tests' folder and process the CMakeLists.txt file found there
add_subdirectory(tests)