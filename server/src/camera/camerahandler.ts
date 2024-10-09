"use strict"
import { each, indexOf } from "lodash";
import { exec } from "shelljs";
import { CameraInfo } from "../../../common/src/data";
import { ICameraManager } from "../interface/CameraManager";
import { ICameraStatusReporter } from "../interface/CameraStatusReporter";

export class MjpgCameraHandler implements ICameraManager, ICameraStatusReporter {
    private cameras : CameraInfo[];
    
    constructor() {
        this.cameras = this.createDefaultSetup();
    }

    public startCameras() {
        // TODO: what if already started?
        let command = 
        //  `/usr/local/bin/mjpg_streamer -i "/home/pi/mjpg-streamer/mjpg-streamer-experimental/input_uvc.so -d ${this.cameras[0].device} -r ${this.cameras[0].width}x${this.cameras[0].height}" -i "/home/pi/mjpg-streamer/mjpg-streamer-experimental/input_uvc.so -d ${this.cameras[1].device} -r 320x240" -i "/home/pi/mjpg-streamer/mjpg-streamer-experimental/input_uvc.so -d ${this.cameras[2].device} -r 320x240" -o "/home/pi/mjpg-streamer/mjpg-streamer-experimental/output_http.so -w /home/pi/mjpg-streamer/mjpg-streamer-experimental/www -p 8080"`
        '/usr/local/bin/mjpg_streamer ';
        each(this.cameras, (camera : CameraInfo) => {
            command += this.createCameraCommand(camera);
        });
        
        command += '-o "/home/pi/mjpg-streamer/mjpg-streamer-experimental/output_http.so -w /home/pi/mjpg-streamer/mjpg-streamer-experimental/www -p 8080"';

        exec(command, {async:true, silent:false});
        console.log(command);
    }

    public stopCameras() {
        const command = 'kill -9 `pidof mjpg_streamer`';
        exec(command, {async:true, silent:true})
        // console.log(command);
    }

    public getCameras() : CameraInfo[] {
        return this.cameras;
    }

    private restart() {
        const command = 'kill -9 `pidof mjpg_streamer`';
        // console.log(command);
        exec(command, {async: true, silent: true}, () => {
            this.startCameras();
        });
    }

    public nextCameraSetup() {
        this.cameras.push(this.cameras.shift());
        this.updateCameraSizes();
        this.restart();
    }

    public previousCameraSetup() {
        this.cameras.unshift(this.cameras.pop());
        this.updateCameraSizes();
        this.restart();
    }

    private createDefaultSetup() : CameraInfo[] {
        const cameras : CameraInfo[] = [];

        cameras.push({
            device: "/dev/video4",
            name: "Left cam",
            width: 1280,
            height: 720
        });
        
        cameras.push({
            device: "/dev/video2",
            name: "Front cam",
            width: 1280,
            height: 720
        });

        cameras.push({
            device: "/dev/video0",
            name: "Right cam",
            width: 1280,
            height: 720
        });

        

        return cameras;
    }

    private createCameraCommand(camera : CameraInfo) : string {
        const ret = exec("ls " + camera.device, { async: false});
        if (ret.code !== 0) {
            return " ";' //-i "/home/pi/mjpg-streamer/mjpg-streamer-experimental/input_testpicture.so -r ' + camera.width + 'x' + camera.height + '"';
        } else {
            return ` -i "/home/pi/mjpg-streamer/mjpg-streamer-experimental/input_uvc.so -d ${camera.device} -r ${camera.width}x${camera.height}"`;
        }
    }

    private updateCameraSizes() : void {
        for (let i = 0; i < this.cameras.length; i++) {
            const camera : CameraInfo = this.cameras[i];
            // if (i == 0) {
                camera.width = 1280;
                camera.height = 720;
            // } else {
                // camera.width = 320;
                // camera.height = 240;
            // }
        }
        
    }
}