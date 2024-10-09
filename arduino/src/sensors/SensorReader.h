#ifndef SensorReader_h
#define SensorReader_h

//#include <MPU9250.h>
#include <SparkFun_MS5803_I2C.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BNO055.h>

#include "ISensorReader.h"

// over how many sensor readings the actual value is average of
const unsigned int NOF_READINGS = 4;

const unsigned long TIME_BETWEEN_READS = 1000; // ms

class SensorReader : public ISensorReader {
    public:
        SensorReader(unsigned long timeout);
        void readPeriodically();
        float getVoltage();
        float getCurrent();
        float getPitch();
        float getRoll();
        float getYaw();
        float getHeading();
        float getInsideTemp();
        float getOutsideTemp();
        float getDepth();
    private:
        int _voltPin;
        int _currPin;
        
        // data buffers
        float _voltage_table[NOF_READINGS];
        float _current_table[NOF_READINGS];
        unsigned int _index;

        // for old position sensor
        // MPU9250 _mpu;
        // bool _mpu_update_status = false;

        // for new attitude sensor (Adafruit BNO055)
        Adafruit_BNO055 _bno = Adafruit_BNO055(55, 0x28);
        sensors_event_t _orien_data;
        sensors_event_t _accel_data;
        imu::Vector<3> _euler; // raw data

        double _headingVelocity = 0;
        double DEG_2_RAD = 0.01745329251; //trig functions require radians, BNO055 outputs degrees
        uint16_t BNO055_SAMPLERATE_DELAY_MS = 10; //how often to read data from the board
        double ACCEL_VEL_TRANSITION =  (double)(BNO055_SAMPLERATE_DELAY_MS) / 1000.0;

        // for depth sensor
        MS5803 _ms = MS5803(ADDRESS_HIGH);

        unsigned long _last_read;
        unsigned long _timeout;

        bool _setup = false;
        void setup();
        
};

#endif // SensorReader_h