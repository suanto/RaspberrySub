#ifndef AppBuilder_h
#define AppBuilder_h

#include "app.h"

enum LEDType {
    TypeCreeLED = 0
};

enum EngineType {
    TypeBLDCEngine = 0
};

enum EngineControllerType {
    TypeSixBLDCController = 0
};

enum PilotType {
    TypeSemimanualPilot = 0
};

class AppBuilder {
    public:
        AppBuilder();
        void setLEDCount(int count);
        void setLEDType(LEDType type);
        void setLEDPins(int * pins);
        void setEngineCount(int count);
        void setEngineType(EngineType type);
        void setEnginePins(int * pins);
        void setEngineControllerType(EngineControllerType type);
        void setPilotType(PilotType type);
        App* buildApp();
    
    private:
        int _ledCount;
        LEDType _ledType;
        int* _ledPins;
        int _engineCount;
        EngineType _engineType;
        int* _enginePins;
        EngineControllerType _engineControllerType;
        PilotType _pilotType;
};

#endif // AppBuilder_h