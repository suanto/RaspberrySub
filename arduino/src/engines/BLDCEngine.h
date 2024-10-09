#ifndef BLDCEngine_h
#define BLDCEngine_h

#include <Servo.h>

#include "IEngine.h"

// How many promilles more power per millisecond
// 1 means full power in one second
// 2 means full power in half second
const float POWER_INCREASE_PER_MS = 0.1;

// how many percentage points can power increase in single step
// concerns mostly startup and if arduino busy during update
const float MAX_POWER_INCREASE_PERCENT_PER_STEP = 0.1;

class BLDCEngine : public IEngine {
    public:
        BLDCEngine(int pin);

        /**
        * Power: -1 ... 0 ... 1
        * = full reverse, stop, full ahead flank
        */
        void setPower(float power);

        /**
        * return current power  -1 ... 1
        * if feedback sensor not available return last send power
        */
        float getPower();

        /**
         * Call periodically, as this function runs the smooth power increase.
         */ 
        void run();

        void arm();
        void disarm();

    private:

        /**
         * 0 ... 1 power to us (microseconds) (1100 ... 1500 ... 1900)
         */
        int translatePower(float power);

        /**
         * Check if engine direction has changed from last update
         */

        bool hasDirectionChanged(float current, float wanted);

        
        float _wanted_power;
        float _current_power;
        
        unsigned long _lastUpdateTime;

        int _pin;
        Servo _engine;
        bool _armed;
};

#endif // BLDCEngine_h