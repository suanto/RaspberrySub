#include "debug.h"

void DEBUG(String msg) {
    String message = "DEBUG: " + msg;
    Serial.println(message.c_str());
}