#include "MockComReader.h"

MockComReader::MockComReader() : _i (0) {
    _messages = new String[13];
    _messages[0] = String("01000");
    _messages[1] = String("05011");
    _messages[2] = String("05011");
    _messages[3] = String("05011");
    _messages[4] = String("05011");
    _messages[5] = String("05011");
    _messages[6] = String("05011");
    _messages[7] = String("05-10");
    _messages[8] = String("05-11");
    _messages[9] = String("05-11");
    _messages[10] = String("05-11");
    _messages[11] = String("05011");
    _messages[12] = String("05011");
    _msgCount = 13;
}
int MockComReader::readComs() {
    return 1;
}

Command MockComReader::getMessage() {
    if (_i++ >= _msgCount) _i = 0;

    return _messages[_i]; 
}