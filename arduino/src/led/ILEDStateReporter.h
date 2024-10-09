#ifndef ILEDStateReporter_h
#define ILEDStateReporter_h

class ILEDStateReporter {
    public:
        virtual void getIntensities(float * intensities);
        virtual int getActiveLed();
        virtual int getLedCount();
};

#endif // ILEDStateReporter_h