#include "StatusSender.h"
#include "../logger/debug.h"

StatusSender::StatusSender(IPilotStateReporter* pilot, ILEDStateReporter* led, IEngineStateReporter* engine, IComWriter* writer, ISensorReader* sensors, unsigned long interval) : 
    _MSG_INTERVAL_MS (interval)
{
    _pilotState = pilot;
    _ledState = led;
    _engineState = engine;
    _comWriter = writer;
    _sensors = sensors;
    _lastMessageTime = 0;
}

void StatusSender::sendStatusMsgIfNeeded() {
    if (messageIntervalPassed() == true) {
        Dataframe frame;
        gatherMessage(frame);
        _comWriter->writeComs(frame);
        _lastMessageTime = millis();
    }
}

bool StatusSender::messageIntervalPassed() {
    if (millis() - _lastMessageTime >= _MSG_INTERVAL_MS) {
        return true;
    }
    return false;
}

void StatusSender::gatherMessage(Dataframe& frame) {
    frame.setArmed(_pilotState->isArmed());
    frame.setPowerfactor(_pilotState->getPowerfactor());
    frame.setDepth(0); // TODO

    // led
    frame.setActiveLight(_ledState->getActiveLed());

    int ledCount = _ledState->getLedCount();
    frame.setLEDCount(ledCount);

    float ledIntensityArray[ledCount];
    _ledState->getIntensities(ledIntensityArray);
    frame.setLEDIntensities(ledIntensityArray);

    // engines
    int engineCount = _engineState->getEngineCount();
    float enginePowers[engineCount];
    _engineState->enginePowerStates(enginePowers);

    frame.setNumberOfEngine(engineCount);
    frame.setEnginepowers(enginePowers);
    frame.setPowerfactor(_pilotState->getPowerfactor());

    // sensor data 
    frame.setVoltage(_sensors->getVoltage());
    frame.setCurrent(_sensors->getCurrent());

    frame.setTemperatureIn(_sensors->getInsideTemp());
    frame.setTemperatureOut(_sensors->getOutsideTemp());
    frame.setDepth(_sensors->getDepth());
    frame.setHeading(_sensors->getHeading());
    frame.setPitch(_sensors->getPitch());
    frame.setRoll(_sensors->getRoll());

}