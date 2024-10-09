#ifndef IEngine_h
#define IEngine_h

class IEngine {
    public:
        virtual void setPower(float power);
        virtual float getPower();
        virtual void run();
        virtual void arm();
        virtual void disarm();
};

#endif // IEngine_h