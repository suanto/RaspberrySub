#include "CommandHandler.h"
#include "Command.h"
#include "../logger/debug.h"

CommandHandler::CommandHandler(IPilot* pilot, ILEDController* ledController) {

    // TODO: error handling on null pointer
    _pilot = pilot;
    _ledController = ledController;

}

void CommandHandler::handleCommand(Command command) {
    handleMessage(command);
}

void CommandHandler::handleMessage(Command cmd) {

    if (cmd.GetCommand() != -1) DEBUG(String("CommandHandler::handleMessage: ") + cmd.GetCommand());

    switch(cmd.GetCommand()) {
        case 1: //  01 = THROTTLE
            _pilot->throttle(cmd.GetValue());
            break;

        case 2: // 02 = YAW
            _pilot->yaw(cmd.GetValue());
            break;

        case 3: // 03 = PITCH 
            _pilot->pitch(cmd.GetValue());
            break;

        case 4: // 04 = ROLL 
            _pilot->roll(cmd.GetValue());
            break;
            
        case 5: // 05 = CHANGE LIGHT INTENSITY
            _ledController->changeIntensity(cmd.GetValue());
            break;

        case 6: // 06 = ACTIVE_LIGHT
            _ledController->changeActiveLED(cmd.GetValue());
            break;

        case 7: // 07 = DEPTH_LOCK
            _pilot->setDepthLock(cmd.GetValue());
            break;

        case 8: // 08 = SPD_AND_HDNG_LOCK
            _pilot->setHeadingLock(cmd.GetValue());
            _pilot->setSpeedLock(cmd.GetValue());
            break;

        case 9: // 09 = HEARTBEAT
            _pilot->heartbeat(cmd.GetValue());
            break;

        case 10: // 10 = POWERFACTOR
            _pilot->setPowerfactor(cmd.GetValue());
            break;

        case 11: // 11 = ARM
            _pilot->arm();
            break;

        case 12: // 12 = DISARM
            _pilot->disarm();
            break;
    }
}
