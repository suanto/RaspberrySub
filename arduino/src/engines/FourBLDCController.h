#ifndef FourBLDCController_h
#define FourBLDCController_h

#include "IEngineController.h"
#include "IEngineStateReporter.h"
#include "IEngine.h"

const int ENGINE_COUNT = 4;

/*
* Four thrusters, two for up/down, two for lateral movement. 
* 1 4 (Up/down, 1= top left corner, 4 right bottom corner)
* 2 3 (Lateral movement, 2 = top right corner, 3 = left bottom corner)
*/

class FourBLDCController : public IEngineController, public IEngineStateReporter {
    public:
        FourBLDCController(IEngine* engines[]);

        /*
        * Up / down (1 ... -1)
        */
        void throttle(float power);

        /*
        * Turning left / right (-1 ... 1)
        */  
        void yaw(float power);

        /*
        * Movement front / back (1 ... -1)
        */
        void pitch(float pwer);

        /*
        * Movement left / right (-1 ... 1)
        * 
        * Not supported.
        */
        void roll(float power);

        int getEngineCount();
        void enginePowerStates(float * powerStates);

        void run();
        void arm();
        void disarm();
        
    private:

        // update wanted power to engine
        void updateEngines();
        
        /*
        * Level inputs to comparable level, ie. reduced yaw by 60%
        */
        void levelInputs(float& pitch, float& roll, float& yaw);

        /*
        * Normalized all inputs to same level, ie. makes combined wanted power not over 1
        * ie. engine not run over 100%
        * if sum of abs inputs under 1, does nothing
        */
        void normalizeInputs(float& pitch, float& roll, float& yaw);

        /*
        * Calculates the required power to four engine array
        * 
        * Function outputs required power by engine (-1 ... 1) to engine_array
        * Caller must allocate the array (min. 4 length)
        */
        void calculatePower(float pitch, float roll, float yaw, float throttle, float engine_array[]);

        /*
        * Updates calculated power to engines
        */
        void setEnginesPower(float engine_array[]);
        
        /**
         * Check raw input is between -1 and 1. Clamp if necessary.
         */
        float clampRawInput(float input);

        IEngine* _engines[ENGINE_COUNT];

        /*
        Raw input (-1 ... 1), remote control current movement values
        */
        // -1 (down) ... 1 (up)
        float _raw_input_throttle = 0;

        // turning -1 (left)  ... 1 (right)
        float _raw_input_yaw = 0;

        // movement -1 (back) ... 1 (front)
        float _raw_input_pitch = 0;

        // movement side to side: -1 (left) ... 1 (right)
        float _raw_input_roll = 0;
};

#endif // FourBLDCController_h