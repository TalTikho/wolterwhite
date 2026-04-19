#ifndef IMENU_H
#define IMENU_H

class IMenu{
    public:
        virtual ~IMenu() = default;
        virtual enum nextCommand() = 0;
};



#endif