#ifndef SixBLDCController_h
#define SixBLDCController_h

#include "IEngineController.h"
#include "IEngineStateReporter.h"
#include "IEngine.h"

const int ENGINE_COUNT = 6;

/*
* Thrusters is diamond shape, in about 20-45 degree, for horizontal and lateral movement
* and two thrusters up and down movement
* 1 2 (regular impeller direction, ie forward pushes water to back of the rov)
* 3 4 (regular impeller direction, ie forward pushes water to front of the rov)
* 5 6 (regular impeller direction, ie forward pushes water to bottom of the sea)
*/

class SixBLDCController : public IEngineController, public IEngineStateReporter {
    public:
        SixBLDCController(IEngine* engines[]);

        /*
        up / down (1 ... -1)
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
        * Thrusters is diamond shape, in about 20-45 degree, for horizontal and lateral movement
        * and two thrusters up and down movement
        * 1 2 (regular impeller direction, ie forward pushes water to back of the rov)
        * 3 4 (regular impeller direction, ie forward pushes water to front of the rov)
        * 5 6 (regular impeller direction, ie forward pushes water to bottom of the sea)
        * 
        * Function outputs required power by engine (-1 ... 1) to engine_array
        * Caller must allocate the array (min. 6 length)
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

#endif // SixBLDCController_h