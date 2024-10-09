#include "LEDController.h"
#include "../led/ILED.h"

LEDController::LEDController(int ledCount, ILED* leds[]) {
    _ledCount = ledCount;
    _activeLED = 0;
    for (int i = 0; i < ledCount && i < 10; i++) {
        _ledArray[i] = leds[i];
    }
}
        
void LEDController::changeIntensity(float intensity) {
    for (int i = 0; i < _ledCount; i++) {
        _ledArray[i]->changeIntensity(intensity);
    }
}

void LEDController::changeActiveLED(int direction) {
     if (direction > 0) {
         activateNextLED();
     } else {
         activatePreviousLED();
     }
}

void LEDController::getIntensities(float* intensities) {
    for (int i = 0; i < _ledCount; i++) {
        intensities[i] = _ledArray[i]->getIntensity();
    }
}

void LEDController::activateNextLED() {
    _activeLED++;
    if (_activeLED >= _ledCount) _activeLED = 0;
}

void LEDController::activatePreviousLED() {
    _activeLED--;
    if (_activeLED < 0) _activeLED = _ledCount - 1;
}

int LEDController::getActiveLed() {
    return _activeLED;
}

int LEDController::getLedCount() {
    return _ledCount;
}
