#include <Arduino.h>
#include "FourBLDCController.h"

FourBLDCController::FourBLDCController(IEngine* engines[]) {
    
    for (int i = 0; i < ENGINE_COUNT; i++) {
        _engines[i] = engines[i];
    }
}

float FourBLDCController::clampRawInput(float input) {
    
    if (input > 1) return 1;
    if (input < -1) return -1;
    return input;
}

void FourBLDCController::throttle(float power) {
    _raw_input_throttle = clampRawInput(power);
    updateEngines();
}

void FourBLDCController::yaw(float power) {
   _raw_input_yaw = clampRawInput(power);
   updateEngines();
}

void FourBLDCController::pitch(float power) {
    _raw_input_pitch = clampRawInput(power);
    updateEngines();
}

void FourBLDCController::roll(float power) {
    _raw_input_roll = clampRawInput(power);
    updateEngines();
}

void FourBLDCController::updateEngines() {
    float pitch = _raw_input_pitch;
    float roll = _raw_input_roll;
    float yaw = _raw_input_yaw;
    float engine_array[ENGINE_COUNT] = {0,0,0,0};

    levelInputs(pitch, roll, yaw);
    normalizeInputs(pitch, roll, yaw);
    calculatePower(pitch, roll, yaw, _raw_input_throttle, engine_array);
    setEnginesPower(engine_array);
}

int FourBLDCController::getEngineCount() {
    return ENGINE_COUNT; 
}

void FourBLDCController::arm() {
    for(int i = 0; i < ENGINE_COUNT; i++) {
        _engines[i]->arm(); 
    }
}

void FourBLDCController::disarm() {
    _raw_input_throttle = _raw_input_yaw = _raw_input_pitch = _raw_input_roll = 0;
    for(int i = 0; i < ENGINE_COUNT; i++) {
        _engines[i]->disarm(); 
    }
}

void FourBLDCController::enginePowerStates(float * powerStates) {
    for (int i = 0; i < ENGINE_COUNT; i++) {
        powerStates[i] = _engines[i]->getPower();
    }
}

void FourBLDCController::levelInputs(float& pitch, float& roll, float& yaw) {
     yaw = constrain(yaw, -0.4, 0.4);  // 2020-06-25 sluggish turning, commented for now
}

void FourBLDCController::normalizeInputs(float& pitch, float& roll, float& yaw) {
    float abs_sum = abs(pitch) + abs(roll) + abs(yaw);
    if (abs_sum > 1) {
        pitch /= abs_sum;
        roll /= abs_sum;
        yaw /= abs_sum;
    }
}

void FourBLDCController::calculatePower(float pitch, float roll, float yaw, float throttle, float engine_array[]) {
    // engine_array[0] = (pitch + roll + yaw);
    // engine_array[1] = (pitch - roll - yaw);
    // engine_array[2] = (-pitch + roll - yaw);
    // engine_array[3] = (-pitch - roll + yaw);
    // engine_array[4] = throttle;
    // engine_array[5] = throttle;
    engine_array[0] = throttle;
    engine_array[3] = throttle;

    engine_array[1] = (pitch + yaw);
    engine_array[2] = (pitch - yaw);
}

void FourBLDCController::setEnginesPower(float engine_array[]) {
    for (int i = 0; i < ENGINE_COUNT; i++) {
        _engines[i]->setPower(engine_array[i]);
    }
}

void FourBLDCController::run() {
    for (int i = 0; i < ENGINE_COUNT; i++) {
        _engines[i]->run();
    }
}


