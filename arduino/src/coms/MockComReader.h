#ifndef MockComReader_h
#define MockComReader_h

#include <Arduino.h>
#include "IComReader.h"

class MockComReader : public IComReader {
    public:
        MockComReader();
        /*
            0 = no message
            1 = message ready
        */
        int readComs();

        /*
        message or null
        */
        Command getMessage();

    private:
        int _i;
        int _msgCount;
        String* _messages; 
};

#endif // MockComReader_h