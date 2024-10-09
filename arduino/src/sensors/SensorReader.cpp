#include <Arduino.h>
#include <Wire.h>
#include "SensorReader.h"
#include "../logger/debug.h"

SensorReader::SensorReader(unsigned long timeout) : _timeout(timeout) {
    _voltPin = A0;
    _currPin = A1;
    memset(_voltage_table, 0, sizeof(_voltage_table));
    memset(_current_table, 0, sizeof(_current_table));
    _index = 0;
    _setup = false;
    // _mpu_update_status = 0;
}

void SensorReader::readPeriodically() {

    if (millis() - _last_read < TIME_BETWEEN_READS) {
        // too soon
        return;
    }

    setup();
    
    // read volts
    int volt = analogRead(A0);//_voltPin);
    _voltage_table[_index] = (float) volt / (float) 1024 * (float)5 * (float)11.7;

    // read amps
    int curr = analogRead(A1);
    _current_table[_index]  = (float) curr / (float) 1024 * (float)5 * (float) 90;

    // read attitude
    _euler = _bno.getVector(Adafruit_BNO055::VECTOR_EULER);
    _bno.getEvent(&_orien_data, Adafruit_BNO055::VECTOR_EULER);
    _bno.getEvent(&_accel_data, Adafruit_BNO055::VECTOR_LINEARACCEL);


    // speed?
      // velocity of sensor in the direction it's facing
        _headingVelocity = ACCEL_VEL_TRANSITION * _accel_data.acceleration.x / cos(DEG_2_RAD * _orien_data.orientation.x);

    _index++;
    if (_index >= NOF_READINGS) _index = 0;

    _last_read = millis();
}

float SensorReader::getVoltage() {
    float sum = 0;
    for (unsigned int i = 0; i < NOF_READINGS; i++) {
        sum += _voltage_table[i];
    }
    return sum / NOF_READINGS;
}

float SensorReader::getCurrent() {
    float sum = 0;
    for (unsigned int i = 0; i < NOF_READINGS; i++) {
        sum += _current_table[i];
    }
    return sum / NOF_READINGS;
}

float SensorReader::getPitch() {
    return _orien_data.orientation.y;
}

float SensorReader::getRoll() {
    return _orien_data.orientation.roll;
}

float SensorReader::getYaw() {
    // return _orien_data.orientation.pitch;
    return _euler.x();
}

float SensorReader::getInsideTemp() {
    return _bno.getTemp();

}

float SensorReader::getHeading() {
//    return _orien_data.orientation.heading;
    return _euler.x();
}

float SensorReader::getOutsideTemp() {
    return _ms.getTemperature(CELSIUS, ADC_512);
}

float SensorReader::getDepth() {
    return (_ms.getPressure(ADC_4096) / 100) - 10;
}

void SensorReader::setup() {
    if (_setup) return; // not twice

    Wire.begin();
    delay(2000);
    Wire.setWireTimeout(_timeout, true);
    
    // setup bno, no idea what this does, copied from https://github.com/mbercas/attitude_bno055/blob/main/notes/adafruit-bno055-absolute-orientation-sensor.pdf
    _bno.begin();
    _bno.setExtCrystalUse(true);

    _ms.reset();
    _ms.begin();

    _setup = true;
}

