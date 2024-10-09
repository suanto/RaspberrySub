#ifndef IPilotStateReporter_h
#define IPilotStateReporter_h


class IPilotStateReporter {
    public:
        virtual bool isArmed();
        virtual float getPowerfactor();
        virtual bool getSpeedlockState();
};

#endif // IPilotStateReporter_h
