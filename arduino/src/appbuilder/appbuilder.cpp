#include "appbuilder.h"
#include "../led/ILED.h"
#include "../led/CreeLED.h"
#include "../led/LEDController.h"
#include "../pilots/SemimanualPilot.h"
#include "../engines/BLDCEngine.h"
#include "../engines/FourBLDCController.h"
#include "../coms/MockComReader.h"
#include "../coms/SerialComReader.h"
#include "../coms/StatusSender.h"
#include "../coms/SerialComWriter.h"
#include "../sensors/SensorReader.h"

AppBuilder::AppBuilder() {

}

void AppBuilder::setLEDCount(int count) {
    _ledCount = count;
}

void AppBuilder::setLEDType(LEDType type) {
    _ledType = type;
}

void AppBuilder::setLEDPins(int * pins) {
    _ledPins = pins;
}

void AppBuilder::setEngineCount(int count) {
    _engineCount = count;
}

void AppBuilder::setEngineType(EngineType type) {
    _engineType = type;
}

void AppBuilder::setEnginePins(int * pins) {
    _enginePins = pins;
}

void AppBuilder::setEngineControllerType(EngineControllerType type) {
    _engineControllerType = type;
}

void AppBuilder::setPilotType(PilotType type) {
    _pilotType = type;
}

App* AppBuilder::buildApp() {
    // LEDs

    CreeLED* leds[3];
    leds[0] = new CreeLED(8);
    leds[1] = new CreeLED(9);
    leds[2] = new CreeLED(10);
    LEDController* ledController = new LEDController(3, (ILED**)leds);

    // Engines
    // Esc Moottori
	// 5 6
	// 6 4
	// 2 3
	// 3 2 
	// 4 5
	// 1 1
    BLDCEngine* engines[6];
    engines[0] = new BLDCEngine(/*2*/ 2); // ESC 1 - Engine 1
    engines[1] = new BLDCEngine(/*3*/ 3);  // ESC 2 - Engine 3
    engines[2] = new BLDCEngine(/*4*/ 4);       // ESC 3 - Engine 2
    engines[3] = new BLDCEngine(/*5*/ 6);       // ESC 4 - Engine 5
    //engines[4] = new BLDCEngine(6);       // ESC 5 - Engine 6
    //engines[5] = new BLDCEngine(7);       // ESC 6 - Engine 4

    // SixBLDCController* engineController = new SixBLDCController((IEngine**)engines);
    FourBLDCController* engineController = new FourBLDCController((IEngine**)engines);


    SemimanualPilot* pilot = new SemimanualPilot(engineController, 3500);
    
    CommandHandler* com = new CommandHandler(pilot, ledController);

    // sensors
    SensorReader* sensors = new SensorReader(1000);

    SerialComReader* comReader = new SerialComReader();
    SerialComWriter* comWriter = new SerialComWriter();

    StatusSender* statusSender = new StatusSender(pilot, ledController, engineController, comWriter, sensors, 250);

    App* app = new App(pilot, com, comReader, statusSender, sensors);
    return app;
}