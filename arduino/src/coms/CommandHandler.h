#ifndef CommandHandler_h
#define CommandHandler_h

#include <Arduino.h>

#include "../pilots/IPilot.h"
#include "../led/ILEDController.h"
#include "../coms/Command.h"

class CommandHandler {
    public:
        CommandHandler(IPilot * pilot, ILEDController* ledController);

        /*
        This should be called from the loop.
        Reads com, if message ready, handles the message.
        */
        void handleCommand(Command command);
    
    private:
        IPilot* _pilot;
        ILEDController* _ledController;

        void handleMessage(Command cmd);

};

#endif // CommandHandler_h
