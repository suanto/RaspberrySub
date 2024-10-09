#ifndef ILED_h
#define ILED_h

class ILED {
    public:

        /*
        * - 10 / +10, negative value reduces intensity, positive increases intensity
        */
        virtual void changeIntensity(float intensity);

        /*
        * Return current light intensity
        * Range: 0 ... 1
        */ 
        virtual float getIntensity();
};

#endif // ILED_h