"use strict";

export enum CommandType {

    // camera control
    ChangeCamera = "ChangeCamera",
    
    // movement
    Throttle = "Throttle",
    Yaw = "Yaw",
    Pitch = "Pitch",
    Roll = "Roll",

    // arming
    Arm = "Arm",
    Disarm = "Disarm",

    // to indicate live connection
    Heartbeat = "Heartbeat",

    // autopilot
    Depthlock = "Depthlock",
    HeadingAndSpeedLock = "HeadingAndSpeedLock",

    // lights
    Lights = "Lights",

    // power
    Powerfactor = "Powerfactor",

    // shutdown
    Shutdown = "Shutdown",
    Reboot = "Reboot"
}

export interface Command {
    cmdType : CommandType,
    value : number
}