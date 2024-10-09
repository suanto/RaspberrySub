#include "app.h"
#include "../logger/debug.h"

App::App(IPilot* pilot, CommandHandler* commandHandler, IComReader* comReader, StatusSender* statusSender, ISensorReader* sensors) {
    _pilot = pilot;
    _commandHandler = commandHandler;
    _comReader = comReader;
    _statusSender = statusSender;
    _sensors = sensors;
}

void App::run() {    
    if (_comReader->readComs()) {
        _commandHandler->handleCommand(_comReader->getMessage());
    }
    _pilot->drive();
    _sensors->readPeriodically();
    _statusSender->sendStatusMsgIfNeeded();

}