#include "HelpCommand.h"
#include <iostream>
using namespace std;

void HelpCommand::execute(std::istringstream& args){
    cout << "add [userid] [productid1] [productid2] …" << endl;
    cout << "recommend [userid] [productid]" << endl;
    cout << "help" << endl;
}
