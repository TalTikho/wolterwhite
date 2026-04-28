#====================================================================================================================
# Cmake for the tests folder
#====================================================================================================================
# Sets the minimum version of CMake required to run this script
cmake_minimum_required(VERSION 3.14)

# Enables the FetchContent module to download external dependencies during the build
include(FetchContent)

# Declares where to find the GoogleTest source code and which version
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)

# Fixes a Windows-specific compatibility issue with the C Runtime (CRT) for GoogleTest
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)

# Downloads and makes GoogleTest available to the rest of the project
FetchContent_MakeAvailable(googletest)

add_executable(runTests 
    #Tests go here
    AddProductCommandTests.cpp
    StorageTests.cpp
    # Future test files like RecommendTests.cpp should be added here
)

# Creates the actual executable named 'runTests' using the files listed in TEST_FILES
add_executable(runTests ${TEST_FILES})

# Links the test executable to your project's logic library and the GoogleTest main entry point
#target_link_libraries(runTests PRIVATE project_logic gtest_main) Created a build problem

# Explicitly tells the compiler to look one directory up in 'src' for your header files ()
target_include_directories(runTests PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/../src)

# Turns on strict compiler warnings to ensure high code quality (Wall = All warnings)
target_compile_options(runTests PRIVATE -Wall -Wextra -Wpedantic)

# Copies the 'data' folder from the project root to the test folder so tests can find their text files
file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/../data DESTINATION ${CMAKE_CURRENT_BINARY_DIR})

# Enables the 'ctest' framework which allows you to run all tests with a single command
# enable_testing() NOT SURE ITS NEEDED HERE BECAUSE WE HAVE IT IN THE LARGE SCOPE CMAKE

# Registers 'runTests' as an official test that CMake can track and report on
add_test(NAME AllTests COMMAND runTests)