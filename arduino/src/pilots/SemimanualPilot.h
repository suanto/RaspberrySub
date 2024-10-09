#ifndef SemimanualPilot_h
#define SemimanualPilot_h

#include "IPilot.h"
#include "IPilotStateReporter.h"
#include "../engines/IEngineController.h"

class SemimanualPilot : public IPilot, public IPilotStateReporter {
    public:

        // TODO: we'll also need reference to sensorsReporter
        SemimanualPilot(IEngineController * engineController, unsigned long heartbeatTimeoutMS);

        // from IPilot

        void yaw(float power);
        void throttle(float power);
        void pitch(float power);
        void roll(float power);
        
        void arm();
        void disarm();

        void setPowerfactor(float factor);

        void setDepthLock(bool status);
        void setSpeedLock(bool status);
        void setHeadingLock(bool status);

        // call this from loop, at least when on lockstate (autopilot)
        void drive();

        // from IPilotStateReporter

        bool isArmed();
        float getPowerfactor();
        bool getSpeedlockState();

        void heartbeat(int id);

    private:
        IEngineController* _engineController;
        bool _armed;
        float _powerfactor;
        bool _speedlockState;
        bool _headinglockState;
        bool _depthlockState;

        float _currentThrottle;
        float _currentYaw;
        float _currentPitch;
        float _currentRoll;

        unsigned long _heartbeatTimeoutMs;
        unsigned long _lastHeartbeatRecvdTime;
        int _lastHeartbeatRecvdID;
        void checkTimeout();

};

#endif // SemimanualPilot_h
