#ifndef IComReader_h
#define IComReader_h

#include "Command.h"

class IComReader {
    public:
        /*
            0 = no message
            1 = message ready
        */
        virtual int readComs();

        /*
        message or null
        */
        virtual Command getMessage();
};

#endif // IComReader_h