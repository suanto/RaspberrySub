"use strict"

import { Socket } from "socket.io";
import { ICmdHandler } from "../interface/comhandler";
import { CommandType } from "../../../common/src/command";
import { ICameraManager } from "../interface/CameraManager";
import { ISubmarineController } from "../interface/ISubmarineController";
import { ShutdownHandler } from "../shutdown/shutdownhandler";

export class ServerCmdHandler implements ICmdHandler {
    
    private socket : Socket;
    private cameraHandler : ICameraManager;
    private submarine : ISubmarineController;
    private shutdownHandler = new ShutdownHandler(); // TODO interface

    constructor(socket : Socket, cameraHandler : ICameraManager, submarine : ISubmarineController) {
        if (!socket) throw "ServerComHandler: socket not set";
        if (!cameraHandler) throw "ServerComHandler: camHandler not set";
        if (!submarine) throw "ServerComHandler: submarine not set";

        this.socket = socket;
        this.cameraHandler = cameraHandler;
        this.submarine = submarine;
    }

    public start(): void {

        this.socket.on('disconnect', () => {
            this.submarine.disarm();
            this.cameraHandler.stopCameras();
            console.log('User disconnected');
        });
    
        this.socket.on(CommandType.Heartbeat, (value) => {
            this.submarine.heartbeat(value);
        })
    
        this.socket.on(CommandType.Throttle, (value) => {
            this.submarine.throttle(value);
            console.log("Throttle: " + value );
        })
    
        this.socket.on(CommandType.Yaw, (value) => {
            this.submarine.yaw(value);
            console.log("Yaw: " + value );
        })
    
        this.socket.on(CommandType.Roll, (value) => {
            this.submarine.roll(value);
            console.log("Roll: " + value );
        })
    
        this.socket.on(CommandType.Pitch, (value) => {
            this.submarine.pitch(value);
            console.log("Pitch: " + value );
        })
    
        this.socket.on(CommandType.Arm, (value) => {
            this.submarine.arm();
            console.log("Arm: " + value );
        })
    
        this.socket.on(CommandType.Disarm, (value) => {
            this.submarine.disarm();
            console.log("Disarm: " + value );
        })
    
        this.socket.on(CommandType.ChangeCamera, (value) => {
            if (value > 0) {
                this.cameraHandler.nextCameraSetup();
            } else {
                this.cameraHandler.previousCameraSetup();
            }
            this.submarine.activate_light(value);
            console.log(CommandType.ChangeCamera, value );
        })
    
        this.socket.on(CommandType.Lights , (value) => {
            this.submarine.change_light_intensity(value);
            console.log(CommandType.Lights, value );
        })
    
        this.socket.on(CommandType.HeadingAndSpeedLock, function(value) {
            console.log(CommandType.HeadingAndSpeedLock, value );
        })
    
        this.socket.on(CommandType.Depthlock, function(value) {
            console.log(CommandType.Depthlock, value );
        });

        this.socket.on(CommandType.Powerfactor, (value) => {
            console.log(CommandType.Powerfactor, value);
            this.submarine.powerfactor(value);
        });

        this.socket.on(CommandType.Shutdown, (value) => {
            console.log(CommandType.Shutdown, value);
            this.submarine.disarm();
            this.shutdownHandler.shutdown();
        });

        this.socket.on(CommandType.Reboot, (value) => {
            console.log(CommandType.Reboot, value);
            this.submarine.disarm();
            this.shutdownHandler.reboot();
        });

    }

    stop(): void {
        throw new Error("Method not implemented.");
    }

}