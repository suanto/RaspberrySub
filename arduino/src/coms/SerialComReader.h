#ifndef SerialComReader_h
#define SerialComReader_h

#include "IComReader.h"
#include "Command.h"

class SerialComReader : public IComReader {
    public:
        SerialComReader();


        int readComs();
        Command getMessage();

    private:
        String _serial_message;
        boolean _message_ready;

        void markMessageHandled();


};

#endif // SerialComReader_h