#include "appbuilder/app.h"
#include "appbuilder/appbuilder.h"

App* app;

void setup() {
  Serial.begin(115200);

  AppBuilder appBuilder;
  app = appBuilder.buildApp();
}

void loop() {
  app->run();
}

