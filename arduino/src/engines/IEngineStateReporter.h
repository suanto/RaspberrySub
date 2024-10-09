#ifndef IEngineStateReporter_h
#define IEngineStateReporter_h

struct EnginePowerState {
    int arraySize;
    int* engineArray;
};

class IEngineStateReporter {
    public:

        virtual int getEngineCount();
        virtual void enginePowerStates(float* powerStates);
        
        /**
        * returns 1 = armed, 0 = disarmed
        */
        //virtual int isArmed();
        
        //virtual int getPowerfactor();

};

#endif // IEngineStateReporter_h