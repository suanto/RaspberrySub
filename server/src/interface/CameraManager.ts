"use strict"

export interface ICameraManager {
    startCameras() : void;
    stopCameras() : void;
    nextCameraSetup() : void;
    previousCameraSetup() : void;
}