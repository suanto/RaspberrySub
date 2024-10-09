#include <CRC32.h>

#include "Command.h"
#include "../logger/debug.h"

Command::Command(String command) {
    _command_string = command;
    _command = -1;
    _value = 0;
    _parsed = false;
}

int Command::GetCommand() {
    parseCommand();
    return _command;
} 

float Command::GetValue() {
    parseCommand();
    return _value;
}

/**
 * protocol: |message-id|command-number|value|crc-32|
 * example: |12|10|10|crc-32
 * crc-32 calculated from the beginning of the message until the end of value (not incuding the following pipe)
 */ 
void Command::parseCommand() {
    if (!_parsed && _command_string && _command_string.length() > 7) {
        doParse();
        _parsed = true;
    }
}

void Command::doParse() {
    unsigned long rCRC = 0;
    if (!checkCRC(rCRC)) {
        DEBUG(String("Command::doParse - rejecting msg, crc failed: ") + rCRC );
        return;
    }

    // skip message id
    
    // read command type and value
    // find starting pos'
    int cmdTypeStartingPos = _command_string.indexOf("|", 1) + 1;
    int cmdValueStartingPos = _command_string.indexOf("|", cmdTypeStartingPos) + 1;
    int cmdValueEndingPos = _command_string.indexOf("|", cmdValueStartingPos);

    _command = _command_string.substring(cmdTypeStartingPos, cmdValueStartingPos).toInt();    
    _value = _command_string.substring(cmdValueStartingPos, cmdValueEndingPos).toFloat();
}

boolean Command::checkCRC(unsigned long & pRecvdCRC ) {
    // find the end of message under crc calc
    int lastPipePos = _command_string.lastIndexOf("|");
    unsigned long recvdCRC = strtoul(_command_string.substring(lastPipePos +1, _command_string.length()+1).c_str(), NULL, 10);
    pRecvdCRC = recvdCRC; // returned to caller
    String msgUnderCalculation = _command_string.substring(0,lastPipePos);

    // calc
    unsigned long calcdCRC = CRC32::calculate(msgUnderCalculation.c_str(), msgUnderCalculation.length());
        
    return recvdCRC == calcdCRC;
}


 