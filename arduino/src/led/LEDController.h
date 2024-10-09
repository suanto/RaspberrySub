#ifndef LEDController_h
#define LEDController_h

#include "ILEDController.h"
#include "ILEDStateReporter.h"
#include "ILED.h"

class LEDController : public ILEDController, public ILEDStateReporter {
    public:
        
        LEDController(int ledCount, ILED* leds[]);
        
        /*
        * 0 - 1
        */
        void changeIntensity(float intensity);
        void changeActiveLED(int direction);
        void getIntensities(float* intensities);
        int getActiveLed();
        int getLedCount();

    private:
        int _activeLED;
        int _ledCount;
        ILED* _ledArray[10];

        void activateNextLED();
        void activatePreviousLED();
};

#endif // LEDController_h