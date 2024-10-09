#include <Arduino.h>
#include <math.h>

#include "BLDCEngine.h"

BLDCEngine::BLDCEngine(int pin) : _wanted_power(0), _current_power(0), _lastUpdateTime(0), _pin(pin), _armed(false)  {
}

void BLDCEngine::setPower(float power) {
    if (power > 1) _wanted_power = 1;
    else if (power < -1) _wanted_power = -1;
    else _wanted_power = power;

    run();
}

float BLDCEngine::getPower() {
    return _current_power;
}

void BLDCEngine::arm() {
    _engine.attach(_pin, 1100, 1900);

    _wanted_power = 0;
    _armed = true;
}

void BLDCEngine::disarm() {
    _wanted_power = 0;
    _current_power = 0;
    _engine.writeMicroseconds(translatePower(0));
    delay(20);
    _engine.detach();
    _armed = false;
}


int BLDCEngine::translatePower(float power) {
    return (power * 400) + 1500;
}

void BLDCEngine::run() {

    if (_current_power == _wanted_power || _armed == false) {
        // nothing to do
        return;
    }

    

    // do not increase power too much
    // this in order to prevent voltage spike caused by too fast acceleration
    // decreasing power can be done immideately

    if (_wanted_power == 0) {
        // we want to stop
        
        _current_power = 0;

    } else if (_lastUpdateTime == 0 || hasDirectionChanged(_current_power, _wanted_power)) { 
        // first time OR
        // direction has changed, treat as first time
        
        if (_wanted_power > 0) {
            // first time - forward
            _current_power = min(_wanted_power, MAX_POWER_INCREASE_PERCENT_PER_STEP / 100);
        } else {
            // first time - reverse
            _current_power = max(_wanted_power, -(MAX_POWER_INCREASE_PERCENT_PER_STEP / 100));
        }

    } else if ( 
                (_wanted_power > 0 && _wanted_power < _current_power) || // forward
                (_wanted_power < 0 && _wanted_power > _current_power)   // reverse
            ) {
        
        // revving down
        _current_power = _wanted_power;

    } else {
        
        // revving up - by maximum configured increase ( either single step or by time )
        float increaseByTime = (_lastUpdateTime - millis()) * POWER_INCREASE_PER_MS / 10;
        float increaseByStep = MAX_POWER_INCREASE_PERCENT_PER_STEP / 100;
        float increase = min(increaseByTime, increaseByStep);

        if (_wanted_power > 0) {
        
            // forward
            _current_power = min(_wanted_power, (_current_power + (1 * increase)));
        
        } else {
        
            // reverse
            _current_power = max(_wanted_power, (_current_power - (1 *increase)));
        
        }
    }

    _lastUpdateTime = millis();
    _engine.writeMicroseconds(translatePower(_current_power));

}

bool BLDCEngine::hasDirectionChanged(float current, float wanted) {
    if (current > 0 && wanted < 0) {
        return true;
    } else if (current < 0 && wanted > 0) {
        return true;
    }

    return false;
}
