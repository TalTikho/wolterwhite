#ifndef IMENU_H
#define IMENU_H

class IMenu{
    public:
        virtual ~IMenu() = default;
        virtual int nextCommand() = 0;
};



#endif
