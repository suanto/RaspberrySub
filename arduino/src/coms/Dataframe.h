#ifndef Dataframe_h
#define Dataframe_h

#include <Arduino.h>

#define MAX_ENGINE_COUNT 10
#define MAX_LED_COUNT 10

class  Dataframe {
    public:
        Dataframe();
        String getAsJson();
        
        void setArmed(bool armed);
        void setDepth(float depth);
        void setTemperatureIn(float temperature);
        void setTemperatureOut(float temperature);
        void setCurrent(float current);
        void setVoltage(float voltage);
        void setHeading(float heading);
        void setPitch(float pitch);
        void setRoll(float roll);
        void setPowerfactor(float powerfactor);
        void setActiveLight(int activeLight);
        void setLEDCount(int ledCount);
        void setLEDIntensities(float* lightIntensityArray);
        void setNumberOfEngine(int engineCount);
        void setEnginepowers(float* enginePowerArray);

    private:
        bool _armed;
        float _depth;
        float _temperature_out;
        float _temperature_in;
        float _current;
        float _voltage;
        float _heading;
        float _pitch;
        float _roll;
        float _powerfactor;
        int _activeLight;
        int _ledCount;
        float _lightIntensityArray[MAX_LED_COUNT];
        int _engineCount;
        float _enginePowerArray[MAX_ENGINE_COUNT];
};

#endif // Dataframe_h
