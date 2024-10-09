#include "SerialComReader.h"
#include "../logger/debug.h"

SerialComReader::SerialComReader() {
    _message_ready = false;
    _serial_message = "";
    _serial_message.reserve(50); // just enough
}

int SerialComReader::readComs() {
    while (Serial.available() > 0 && _message_ready == false) {
        
        char received_char = (char) Serial.read();
        _serial_message += received_char;
        
        if (received_char == '\n') {
            _message_ready = true;
            return 1;
        }
    }
    return 0;
}

Command SerialComReader::getMessage() {
    Command cmd = Command(_serial_message);
    markMessageHandled();
    return cmd;
}

void SerialComReader::markMessageHandled() {
    _serial_message = "";
    _message_ready = false;
}