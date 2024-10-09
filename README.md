
# Overview

[Read the backstory](https://suanto.com/2024/06/06/the-time-I-built-an-ROV-01/)

See also [detailed info on build process and technical components](/ROV.md)

This is a custom underwater drone (ROV) software implementation. It was created in a hurry as a prototype to solve missing person cold cases. 

![](/pictures/preparing-to-dive.jpg)
![](/pictures/search-about-to-start.jpg)

More pictures in the ['pictures'-folder](/pictures/).

As the ROV was built in hurry, the emphasis was to get it working reasonably well as fast as possible. The rush shows in the level of documentation, some design choices, and implementation.

The ROV hardware consists of:
* Raspberry Pi (I used v4)
* Arduino Mega
* Laptop / pc, control the ROV with a keyboard or gamepad 
* ESC's, motors, and sensors
* Cameras and LEDs
* 4S LiPo battery with fuses and a power module
* Sensors
* Lights and dimmers

The ROV software consists of:
* Client, which runs in a web browser. 
* Server, which is a webserver to serve video feed and relay commands and information between the client and Arduino.
* Arduino, which controls motors, lights, and sensors.

The software works as follows:
* the ROV is piloted from the surface using a Chromium browser with a keyboard or gamepad. 
* the cameras' videofeeds are served to the browser and drawn to HTML5 Canvas element. 
* the Canvas video can be recorded to webm/mp4-video which contains footage of all of the cameras and OSD-info. The video feed is served by mjpg_streamer. 

The commands from the gamepad and keyboard are sent to a webserver, which relays most commands to Arduino. The webserver doesn't relay the camera and power control commands but handles them by itself. The data from Arduino is sent to the browser periodically (4 times per second).

Much of the configurations are hardcoded, so using a different hw will require coding.

Server and browser code are implemented in TypeScript. Arduino in C++.

*Please note that browsers don't support animated picture in canvas anymore. It used to work in Chrome while I used this code. You might get it working by changing this implementation so that you fetch the images from the stream in the webserver, combine the image in the webserver, and serve the new image to the browser. Or use Ffmepg to stream the video.*

# Folder structure

* arduino/ contains all of the arduino work.
* client/ contains code run in the browser.
* common/ contains code shared between the server and client.
* server/ contains server side code 

# Install
See [installation guide](./install.md).

# Possible problems

The following error when progamming Arduino
```
avrdude: stk500_recv(): programmer is not responding
```
The solution:
Check you board type from platformio.ini

Serial connection problems (from https://serialport.io/docs/guide-installation)
     1. Would you like a login shell to be accessible over the serial?
     2. Would you like the serial port hardware to be enabled?

You must answer No to question 1 and Yes to question 2.

######################################################################################
# Arduino Pins 
######################################################################################

```
Digital Pin 2 - ESC 1 - 1100 μs (reverse) 1500 μs (stop) 1900 μs (forward)    
Digital Pin 3 - ESC 2 - 1100 μs (reverse) 1500 μs (stop) 1900 μs (forward)
Digital Pin 4 - ESC 3 - 1100 μs (reverse) 1500 μs (stop) 1900 μs (forward)
Digital Pin 5 - ESC 4 - 1100 μs (reverse) 1500 μs (stop) 1900 μs (forward)
Digital Pin 6 - ESC 5 - 1100 μs (reverse) 1500 μs (stop) 1900 μs (forward)
Digital Pin 7 - ESC 6 - 1100 μs (reverse) 1500 μs (stop) 1900 μs (forward)

Digital Pin 8  - Led 1 - PWM     
Digital Pin 9  - Led 2 - PWM   
Digital Pin 10 - Led 3 - PWM

Analog Pin A30   Power Module - Voltage
Analog Pin A32   Power Module - Current

i2c
Digital Pin 20 - SCL
Digital Pin 21 - SDA 
3v out
Gnd 

MS5803    - Depth sensor      - address 0x76
MPU9250   - Gyro & Compass    - address 0x68 
Bluedot BNO055

```
# PlatformIO cli commands (debug only)
```
platformio init -b megaatmega2560 (Mega2560)
platformio run
platformio run --target upload
platformio device monitor -p /dev/ttyACM0 -b 115200
```

# Ideas
* stream videos using ffmpeg
* or create canvas in node and send it to the browser

# Licensing
Copyright 2021-2024 Antti Suanto

All code, commands, and configurations released under the MIT-license

# Kudos
[Eric van Dijken (Moki-Rov2) ](https://github.com/Moki38/Moki-ROV2)
