#include "../include/commands/DeleteCommand.h"
#include "DeleteCommand.h"

DeleteCommand::DeleteCommand(IDataStorage &storage, IOutputWriter &writer): d_storage(storage), d_writer(writer){}
void DeleteCommand::execute(std::istringstream &args)
{
}
const std::string DeleteCommand::getPrintoutFormat()
{
    return "DELETE, arguments: [userid] [productid1] [productid2] ...\n";
}
