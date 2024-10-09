#ifndef CreeLED_h
#define CreeLED_h

#include "ILED.h"

class CreeLED : public ILED {
    public:
        /*
        * Arduino pin to use to control the led.
        */
        CreeLED(int pin);

        /*
        * intensity change in percent 0 - 100
        */
        void changeIntensity(float intensity);

        /*
        * Get absolute intesity 0 - 1.
        */
        float getIntensity();

    private: 
        float _intensity;
        int _pin;

        int convertIntensityToPWM(float intensity);
};

#endif // 