#ifndef App_h
#define App_h

#include "../pilots/IPilot.h"
#include "../coms/CommandHandler.h"
#include "../coms/IComReader.h"
#include "../coms/StatusSender.h"
#include "../sensors/ISensorReader.h"

class App {
    public:
        App(IPilot* pilot, CommandHandler* commandHandler, IComReader* comReader, StatusSender* statusSender, ISensorReader* sensors);
        void run();

    private:
        IPilot* _pilot;
        CommandHandler* _commandHandler;
        IComReader* _comReader;
        StatusSender* _statusSender;
        ISensorReader* _sensors;
};

#endif // App_h
