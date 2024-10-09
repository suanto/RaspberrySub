#ifndef StatusSender_h
#define StatusSender_h

#include "../engines/IEngineStateReporter.h"
#include "../led/ILEDStateReporter.h"
#include "../pilots/IPilotStateReporter.h"
#include "../sensors/ISensorReader.h"
#include "IComWriter.h"
#include "Dataframe.h"

class StatusSender {
    public:
        StatusSender(IPilotStateReporter* pilot, ILEDStateReporter* led, IEngineStateReporter* engine, IComWriter* writer, ISensorReader* sensors, unsigned long interval);

        void sendStatusMsgIfNeeded();

    private:
        IPilotStateReporter* _pilotState;
        ILEDStateReporter* _ledState;
        IEngineStateReporter* _engineState;
        IComWriter* _comWriter;
        ISensorReader* _sensors;
        
        unsigned long _lastMessageTime;
        const unsigned long _MSG_INTERVAL_MS;
        bool messageIntervalPassed();
        void gatherMessage(Dataframe& frame);
};

#endif // StatusSender_h