#ifndef SerialComWriter_h
#define SerialComWriter_h

#include "Dataframe.h"
#include "IComWriter.h"

class SerialComWriter : public IComWriter {
    public:
        SerialComWriter();

        int writeComs(Dataframe data);
    
    private:
        
};

#endif // SerialComWriter_h