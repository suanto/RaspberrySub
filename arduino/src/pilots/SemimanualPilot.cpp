#include <Arduino.h>

#include "SemimanualPilot.h"

SemimanualPilot::SemimanualPilot(IEngineController * engineController, unsigned long heartbeatTimeoutMs) : _heartbeatTimeoutMs (heartbeatTimeoutMs) {
    _engineController = engineController;
    _armed = false;
    _powerfactor = 0.1; // TODO
    _speedlockState = false;
    _headinglockState = false;
    _depthlockState = false;
    _lastHeartbeatRecvdID = 0;
    _currentThrottle = _currentYaw = _currentPitch = _currentRoll = 0;
}

void SemimanualPilot::yaw(float power) {
    if (_armed) {
        power = constrain(power, -1, 1);
        _engineController->yaw(_powerfactor * power);
        _currentYaw = power;
    }
}

void SemimanualPilot::throttle(float power) {
    if (_armed) {
        power = constrain(power, -1, 1);
        _engineController->throttle(_powerfactor * power);
        _currentThrottle = power;
    }
}

void SemimanualPilot::pitch(float power) {
    if (_armed) {
        power = constrain(power, -1, 1);
        _engineController->pitch(_powerfactor * power);
        _currentPitch = power;
    }
}

void SemimanualPilot::roll(float power) {
    if (_armed) {
        power = constrain(power, -1, 1);
        _engineController->roll(_powerfactor * power);
        _currentRoll = power;
    }
}

void SemimanualPilot::arm() {
    _engineController->arm();
    _armed = true;
}

void SemimanualPilot::disarm() {
    _currentThrottle = _currentYaw = _currentPitch = _currentRoll = 0;
    _engineController->disarm();
    _armed = false;
}

void SemimanualPilot::setPowerfactor(float factor) {
    _powerfactor += (factor/100);
    _powerfactor = constrain(_powerfactor, 0.1, 1);

    // update new speed to engines
    throttle(_currentThrottle);
    yaw(_currentYaw);
    pitch(_currentPitch);
    roll(_currentRoll);
}

void SemimanualPilot::setDepthLock(bool status) {
    // not implemented
}

void SemimanualPilot::setSpeedLock(bool status) {
    // not implemented
}

void SemimanualPilot::setHeadingLock(bool status) {
    // not implemented
}

// call this from loop, at least when on lockstate (autopilot)
void SemimanualPilot::drive() {
    checkTimeout();
    _engineController->run();
}

bool SemimanualPilot::isArmed() {
    return _armed;
}

float SemimanualPilot::getPowerfactor() {
    return _powerfactor;
}

bool SemimanualPilot::getSpeedlockState() {
    return _speedlockState;
}

void SemimanualPilot::heartbeat(int id) {
    // if (id > _lastHeartbeatRecvdID) {
        _lastHeartbeatRecvdTime = millis();
        _lastHeartbeatRecvdID = id;
    // }
}

void SemimanualPilot::checkTimeout() {
    if (_armed) {
        if ((millis() - _lastHeartbeatRecvdTime) >= _heartbeatTimeoutMs) {
            disarm();
        }
    }
}