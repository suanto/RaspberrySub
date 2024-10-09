
#include "SerialComWriter.h"
#include "../logger/debug.h"

SerialComWriter::SerialComWriter() {

}

int SerialComWriter::writeComs(Dataframe data){
    String dataString = data.getAsJson();

    if (Serial.availableForWrite()) {
        Serial.println(dataString.c_str());
    }
    return 0; // not written
}


