#ifndef IPilot_h
#define IPilot_h


/**
    Class is responsible for actually driving the sub using the motors. Implementations may be automatic or manual. 

    Drive must be called intermittenly, as it the actual is driving done in it when automated.

    Class is also responsible handling the arm/disarm and heartbeat functions.

    Sub _cannot_ power engine when not powered, and must return the sub to safe state when heartbeat is timeout.
*/
class IPilot {
    public:
         /**
        * Turn the sub in horizontally (as if turning the wheel of a car).
        * power: wanted absolute power, between -1 ... 1 (* power factor)
        * power min = 0
        * Power max = power * powerfactor
        */
        virtual void yaw(float power);

        /**
        * Rise or lower vertically.
        * power: wanted absolute power, between -1 ... 1 (* power factor)
        * power min = 0
        * Power max = power * powerfactor        */
        virtual void throttle(float power);

        /**
        * Drive forwards or backwards.
        * power: wanted absolute power, between -1 ... 1 (* power factor)
        * power min = 0
        * Power max = power * powerfactor        */
        virtual void pitch(float pwer);

        /**
        * Strafe left or right.
        * power: wanted absolute power, between -1 ... 1 (* power factor)
        * power min = 0
        * Power max = power * powerfactor        */

        virtual void roll(float power);
        
        /**
        * Arm the engines, ie. engines may run.
        */
        virtual void arm();

        /*
        * Disarm the engines, ie. engines may NOT run.
        */
        virtual void disarm();
        
        /* 
        * Run this periodically to enable driving the sub.
        *
        */
        virtual void drive();

        /*
            Set the maximum power that will be given from engines
            Example: 0.2 = 20% is the maximum power from engine.
            factor: 0 ... 1
        */
       
        virtual void setPowerfactor(float factor);

        /*
            Enable depth lock. Sub will automatically keep current depth. Throttle has no effect.
            status: enable = true, disable = false
        */
        virtual void setDepthLock(bool status);

        /*
            Enable speed lock. Sub will automatically keep current speed. Pitch has no effect.
            status: enable = true, disable = false
        */
        virtual void setSpeedLock(bool status);

        /*
            Enable depth lock. Sub will automatically keep current heading. Yaw has no effect.
            status: enable = true, disable = false
        */
        virtual void setHeadingLock(bool status);


        /*
        * Mark that surface connection is alive. Id is running id number of message. 
        * Implementation may provide check that message not received in wrong sequence.
        */
        virtual void heartbeat(int id);
};

#endif // IPilot_h
