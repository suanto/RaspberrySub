#ifndef ILEDController_h
#define ILEDController_h

class ILEDController {
    public:

        /*
        * -1 ... 1
        */
        virtual void changeIntensity(float intensity);
        virtual void changeActiveLED(int direction);

};

#endif // ILEDController_h