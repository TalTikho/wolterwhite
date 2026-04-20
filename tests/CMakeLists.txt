cmake_minimum_required(VERSION 3.14)
project(wolterwhiteTests)

# GoogleTest requires at least C++17
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)
# For Windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

add_executable(runTests 
    #Tests go here
    StorageTests.cpp

    #Tested files go here
    ../src/FileDataStorage.cpp

)

# FIX: Tell CMake where to find "FileDataStorage.h"
# Since the header is in the 'src' folder, we point to '../src'
target_include_directories(runTests PRIVATE ../src)

target_link_libraries(runTests GTest::gtest_main)
#Should add "add_subdirectory(Tests)" to the main CMakeLists for this one to work. 

# DATA FOLDER: Ensure the 'data' directory exists where the test runs
# Your code looks for "data/test_storage.txt", so we copy the data folder
# from the root to the build directory.
file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/../data DESTINATION ${CMAKE_CURRENT_BINARY_DIR})