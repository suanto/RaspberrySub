#include <Arduino.h>
#include "SixBLDCController.h"

SixBLDCController::SixBLDCController(IEngine* engines[]) {
    
    for (int i = 0; i < ENGINE_COUNT; i++) {
        _engines[i] = engines[i];
    }
}

float SixBLDCController::clampRawInput(float input) {
    
    if (input > 1) return 1;
    if (input < -1) return -1;
    return input;
}

void SixBLDCController::throttle(float power) {
    _raw_input_throttle = clampRawInput(power);
    updateEngines();
}

void SixBLDCController::yaw(float power) {
   _raw_input_yaw = clampRawInput(power);
   updateEngines();
}

void SixBLDCController::pitch(float power) {
    _raw_input_pitch = clampRawInput(power);
    updateEngines();
}

void SixBLDCController::roll(float power) {
    _raw_input_roll = clampRawInput(power);
    updateEngines();
}

void SixBLDCController::updateEngines() {
    float pitch = _raw_input_pitch;
    float roll = _raw_input_roll;
    float yaw = _raw_input_yaw;
    float engine_array[ENGINE_COUNT] = {0,0,0,0,0,0};

    levelInputs(pitch, roll, yaw);
    normalizeInputs(pitch, roll, yaw);
    calculatePower(pitch, roll, yaw, _raw_input_throttle, engine_array);
    setEnginesPower(engine_array);
}

int SixBLDCController::getEngineCount() {
    return ENGINE_COUNT; 
}

void SixBLDCController::arm() {
    for(int i = 0; i < ENGINE_COUNT; i++) {
        _engines[i]->arm(); 
    }
}

void SixBLDCController::disarm() {
    _raw_input_throttle = _raw_input_yaw = _raw_input_pitch = _raw_input_roll = 0;
    for(int i = 0; i < ENGINE_COUNT; i++) {
        _engines[i]->disarm(); 
    }
}

void SixBLDCController::enginePowerStates(float * powerStates) {
    for (int i = 0; i < ENGINE_COUNT; i++) {
        powerStates[i] = _engines[i]->getPower();
    }
}

void SixBLDCController::levelInputs(float& pitch, float& roll, float& yaw) {
     yaw = constrain(yaw, -0.4, 0.4);  // 2020-06-25 sluggish turning, commented for now
}

void SixBLDCController::normalizeInputs(float& pitch, float& roll, float& yaw) {
    float abs_sum = abs(pitch) + abs(roll) + abs(yaw);
    if (abs_sum > 1) {
        pitch /= abs_sum;
        roll /= abs_sum;
        yaw /= abs_sum;
    }
}

void SixBLDCController::calculatePower(float pitch, float roll, float yaw, float throttle, float engine_array[]) {
    engine_array[0] = (pitch + roll + yaw);
    engine_array[1] = (pitch - roll - yaw);
    engine_array[2] = (-pitch + roll - yaw);
    engine_array[3] = (-pitch - roll + yaw);
    engine_array[4] = throttle;
    engine_array[5] = throttle;
}

void SixBLDCController::setEnginesPower(float engine_array[]) {
    for (int i = 0; i < ENGINE_COUNT; i++) {
        _engines[i]->setPower(engine_array[i]);
    }
}

void SixBLDCController::run() {
    for (int i = 0; i < ENGINE_COUNT; i++) {
        _engines[i]->run();
    }
}


