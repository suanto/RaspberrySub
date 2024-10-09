#ifndef Command_h
#define Command_h

#include <Arduino.h>

class Command {
    public:   
        Command(String command);
        /*
            Commands 
                -1 = UNKNOWN
                01 = THROTTLE
                02 = YAW
                03 = PITCH 
                04 = ROLL
                05 = CHANGE LIGHT INTENSITY
                06 = ACTIVE_LIGHT
                07 = DEPTH_LOCK
                08 = SPD_AND_HDNG_LOCK
                09 = HEARTBEAT
                10 = POWERFACTOR
                11 = ARM
                12 = DISARM
        */

        int GetCommand();

        /*

            Throttle, yaw, pitch, roll -1..1
            Change light intensity -10 / + 10
            Active_light -1 / +1
            Locks 0/1
            Heartbeat ID
            Powerfactor -10/+10
        
        */
        float GetValue();

        
    private:
        String _command_string;

        int _command;
        float _value;

        boolean _parsed;

        void parseCommand();
        void doParse();
        boolean checkCRC(unsigned long & pRecvdCRC);

};

#endif // Command_h