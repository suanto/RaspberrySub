#ifndef ISensorReader_h
#define ISensorReader_h

class ISensorReader {
    public:

        /*
        * -1 ... 1
        */
        virtual void readPeriodically();
        virtual float getVoltage();
        virtual float getCurrent();
        virtual float getPitch();
        virtual float getRoll();
        virtual float getYaw();
        virtual float getHeading();
        virtual float getInsideTemp();
        virtual float getOutsideTemp();
        virtual float getDepth();

};

#endif // ISensorReader_h