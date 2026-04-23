cmake_minimum_required(VERSION 3.15)
project(wolterwhite CXX)

add_executable(wolterwhite
    # Main
    # src/App.cpp
    src/main.cpp

    # Commands
    # src/HelpCommand.cpp
    # src/AddProductCommand.cpp
    # src/RecommendCommand.cpp

    # # System
    # src/RecommendEngine.cpp
    # src/UserProductMap.cpp
    # src/ConsoleMenu.cpp
    # src/FileDataStorage.cpp
    # src/SimilarityScorer.cpp
    # src/RelevanceRank.cpp
)

target_include_directories(wolterwhite PRIVATE src)
file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/data DESTINATION ${CMAKE_CURRENT_BINARY_DIR})
# notify CMakeLists.txt that the tests directory exists and should be included in the build
add_subdirectory(tests)