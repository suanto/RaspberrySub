#ifndef IEngineController_h
#define IEngineController_h

class IEngineController {
    public:
        /**
        * -1 ... 1
        */
        virtual void yaw(float power);
        virtual void throttle(float power);
        virtual void pitch(float power);
        virtual void roll(float power);
        
        virtual void arm();
        virtual void disarm();
        virtual void run();
        
};

#endif // IEngineController_h