#include <Arduino.h>

#include "CreeLED.h"

CreeLED::CreeLED(int pin) {

    _intensity = 0;
    _pin = pin;
    pinMode(_pin, OUTPUT);
}

void CreeLED::changeIntensity(float intensity) {
    _intensity += (intensity / 100.0);
    if (_intensity > 1) _intensity = 1;
    else if (_intensity < 0) _intensity = 0;
    analogWrite(_pin, convertIntensityToPWM(_intensity));
}

float CreeLED::getIntensity() { 
    return _intensity;    
}

int CreeLED::convertIntensityToPWM(float intensity) {
    if (intensity > 1) return 255;
    if (intensity < 0) return 0;

    return intensity * 255;
}
