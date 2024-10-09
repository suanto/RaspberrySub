#include "Dataframe.h"

Dataframe::Dataframe() :
    _armed(false), _depth(0), _temperature_out(0), _temperature_in(0),  _current(0), _voltage(0), _heading(0), _pitch(0),
    _roll(0), _powerfactor(0), _activeLight(0), _ledCount(0), _engineCount(0)
{
    memset(_lightIntensityArray, 0, sizeof(_lightIntensityArray));
    memset(_enginePowerArray, 0, sizeof(_enginePowerArray));
}

String Dataframe::getAsJson() {  

    String lightIntensities = "[";
    for (int i = 0; i < _ledCount; i++) {
        if (i > 0) {
            lightIntensities = lightIntensities + ",";
        }
        lightIntensities = lightIntensities + String(_lightIntensityArray[i]);
    }
    lightIntensities =  lightIntensities + "]";

    String enginePowers = "[";
    for (int i = 0; i < _engineCount; i++) {
        if (i > 0) {
            enginePowers = enginePowers + ",";
        }
        enginePowers = enginePowers + String(_enginePowerArray[i]);
    }
    enginePowers = enginePowers + "]";

    char json[500];
    memset(json, 0, sizeof json);
    sprintf(json, "{\"armed\": %i, \"depth\": %f, \"temperature_in\": %f, \"temperature_out\": %f, \"current\": %f, \"voltage\": %f, \"heading\": %f, \"pitch\": %f, \"roll\": %f, \"powerfactor\": %f, \"activeLight\": %i, \"numberOfLights\": %i, \"lightIntensities\": %s, \"numberOfEngines\": %i, \"enginePowers\": %s}", 
        _armed, _depth, _temperature_in, _temperature_out, _current, _voltage, _heading, _pitch, _roll, _powerfactor, _activeLight, _ledCount, lightIntensities.c_str(), _engineCount, enginePowers.c_str());

    return String(json);
}

void Dataframe::setArmed(bool armed) {
    _armed = armed;
}

void Dataframe::setDepth(float depth) {
    _depth = depth;
}

void Dataframe::setTemperatureIn(float temperature) {
    _temperature_in = temperature;
}

void Dataframe::setTemperatureOut(float temperature) {
    _temperature_out = temperature;
}

void Dataframe::setCurrent(float current) {
    _current = current;
}

void Dataframe::setVoltage(float voltage) {
    _voltage = voltage;
}

void Dataframe::setHeading(float heading) {
    _heading = heading;
}

void Dataframe::setPitch(float pitch) {
    _pitch = pitch;
}

void Dataframe::setRoll(float roll) {
    _roll = roll;
}

void Dataframe::setPowerfactor(float powerfactor) {
    _powerfactor = powerfactor;
}

void Dataframe::setActiveLight(int activeLight) {
    _activeLight = activeLight;
}

void Dataframe::setLEDCount(int ledCount) {
    _ledCount = ledCount;
}

void Dataframe::setLEDIntensities(float* lightIntensityArray) {
    for (int i = 0; i < _ledCount; i++) {
        _lightIntensityArray[i] = lightIntensityArray[i];
    }
}

void Dataframe::setNumberOfEngine(int engineCount) {
    _engineCount = engineCount;
}

void Dataframe::setEnginepowers(float* enginePowerArray) {
    for (int i = 0; i < _engineCount; i++) {
        _enginePowerArray[i] = enginePowerArray[i];
    }
}
