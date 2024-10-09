"use strict";

import { io } from 'socket.io-client';
import { TurtleBeachReconGamepadEventMapper } from './controllers/turtlebeach-recon-gamepad-eventmapper';
import { GamepadListener } from './controllers/gamepad-listener';
import { HeartBeat } from './controllers/heartbeat';
import { IController } from "./interfaces/controller";
import { SocketCmdSender } from './socketcmdsender';
import { SubData } from "../../common/src/data";
import { CanvasView } from './view/view';
import { KeyboardListener } from './controllers/keyboard-listener';
import { CommandType } from '../../common/src/command';

// const client: io.Socket = io.io('http://localhost:5000');
const client: io.Socket = io.io('http://192.168.3.3:5000');

const coms : SocketCmdSender = new SocketCmdSender(client);
const controller : IController = new GamepadListener(window, new TurtleBeachReconGamepadEventMapper(coms), {pollIntervalMs : 100});
const keyboard : IController = new KeyboardListener(window.document, coms);
let keyboard_enabled = false;
const heartBeat : IController = new HeartBeat(coms);
const firstCanvas = <HTMLCanvasElement>document.getElementById('firstCamCanvas');
const secondCanvas = <HTMLCanvasElement>document.getElementById('secondCamCanvas');
const thirdCanvas = <HTMLCanvasElement>document.getElementById('thirdCamCanvas');

let view : CanvasView = new CanvasView(firstCanvas, secondCanvas, thirdCanvas);

// for recording
let firstVideoStream ;//= canvas.captureStream(30);
let firstMediaRecorder ;//= new MediaRecorder(videoStream);
let firstVideoChunks = [];

let secondVideoStream ;//= canvas.captureStream(30);
let secondMediaRecorder ;//= new MediaRecorder(videoStream);
let secondVideoChunks = [];

let thirdVideoStream ;//= canvas.captureStream(30);
let thirdMediaRecorder ;//= new MediaRecorder(videoStream);
let thirdVideoChunks = [];


let record : boolean = false;

const handleFirstRecording = function(e) {
    firstVideoChunks.push(e.data);   
}

const handleSecondRecording = function(e) {
    secondVideoChunks.push(e.data);   
}

const handleThirdRecording = function(e) {
    thirdVideoChunks.push(e.data);   
}

function init() {
    client.connect();
    controller.start();
    heartBeat.start();
    view.start();
}

init();

function startRecording() {
    if (record) return;
    
    firstVideoChunks = [];  
    secondVideoChunks = [];
    thirdVideoChunks = [];

    firstVideoStream = (<any>firstCanvas).captureStream(25);
    firstMediaRecorder = new MediaRecorder(firstVideoStream);
    firstMediaRecorder.start();
    firstMediaRecorder.ondataavailable = handleFirstRecording;
    
    secondVideoStream = (<any>secondCanvas).captureStream(25);
    secondMediaRecorder = new MediaRecorder(secondVideoStream);
    secondMediaRecorder.start();
    secondMediaRecorder.ondataavailable = handleSecondRecording;

    thirdVideoStream = (<any>thirdCanvas).captureStream(25);
    thirdMediaRecorder = new MediaRecorder(thirdVideoStream);
    thirdMediaRecorder.start();
    thirdMediaRecorder.ondataavailable = handleThirdRecording;

    record = true;
    
    setButtonsText("start", "Started");
    setButtonsText("stop", "Stop");
}

function stopRecording() {
    if (!record) return;
    record = false;
    
    firstMediaRecorder.stop();
    secondMediaRecorder.stop();
    thirdMediaRecorder.stop();

    // document.getElementById("start").innerText = "Start"
    setButtonsText("start", "Start");
    setButtonsText("stop", "Stopped");

    // document.getElementById("stop").innerText = "Stopped";
}

function setButtonsText(clas : string, text : string) {
    const start_buttons = document.querySelectorAll("." + clas);
    start_buttons.forEach(element => {
        element.innerText = text;
    });
}

function downloadRecording() {
    const firstRecordedBlob = new Blob(firstVideoChunks, {type: "video/mp4"});
    const firstAnchor = document.createElement('a');
    firstAnchor.href = URL.createObjectURL(firstRecordedBlob);
    const videoname = document.getElementById("mission") ? document.getElementById("mission").value : "sub_video";
    firstAnchor.download = videoname + "_firstcam_" + ".webm";
    firstAnchor.target = "_blank";
    firstAnchor.click();

    const secondRecordedBlob = new Blob(secondVideoChunks, {type: "video/mp4"});
    const secondAnchor = document.createElement('a');
    secondAnchor.href = URL.createObjectURL(secondRecordedBlob);
    secondAnchor.download = videoname + "_secondcam_" + ".webm";
    secondAnchor.target = "_blank";
    secondAnchor.click();

    const thirdRecordedBlob = new Blob(firstVideoChunks, {type: "video/mp4"});
    const thirdAnchor = document.createElement('a');
    thirdAnchor.href = URL.createObjectURL(thirdRecordedBlob);
    thirdAnchor.download = videoname + "_thirdcam_" + ".webm";
    thirdAnchor.target = "_blank";
    thirdAnchor.click();

}

const starts = document.querySelectorAll(".start");
starts.forEach(element => {
    element.addEventListener('click', () => {
        startRecording();
    })
});

const stops = document.querySelectorAll(".stop");
stops.forEach(element => {
    element.addEventListener('click', () => {
        stopRecording();
    })
});

const downloads = document.querySelectorAll(".download");
downloads.forEach(element => {
    element.addEventListener('click', () => {
        downloadRecording();
    })
});

const keyboard_enabler = document.querySelectorAll(".keyboard-enabled");
keyboard_enabler.forEach(element => {
    element.addEventListener('click', () => {
       if (keyboard_enabled) {
        keyboard.stop();
        setButtonsText("keyboard-enabled", "Enable keyboard");
        keyboard_enabled = false;
    } else {
        keyboard.start();
        setButtonsText("keyboard-enabled", "Disable keyboard");
        keyboard_enabled = true;
    }
    })
});

const reboots = document.querySelectorAll(".reboot");
reboots.forEach(element => {
    element.addEventListener('click', () => {
        const boot = confirm("Are you sure you want to reboot the sub?");
        if (boot)  {
            coms.send({cmdType: CommandType.Disarm, value: 0});
            coms.send({cmdType: CommandType.Reboot, value: 0});
        }
    });
});  


const shutdown = document.querySelectorAll(".shutdown");
shutdown.forEach(element => {
    element.addEventListener('click', () => {
        const shutdown = confirm("Are you ABSOLUTELY sure you want to shutdown the sub? You cant start it anymore!!!");
        if (shutdown)  {
            coms.send({cmdType: CommandType.Disarm, value: 0});
            coms.send({cmdType: CommandType.Shutdown, value: 0});
        }
    });
}); 

let led_state = 0;

const leds = document.querySelectorAll(".leds");
leds.forEach(element => {
    element.addEventListener('click', () => {
        if (led_state < 90) { // more light
            coms.send({cmdType: CommandType.Lights, value: 33});
            led_state += 33;
        } else { // switch off
            coms.send({cmdType: CommandType.Lights, value: -100});
            led_state = 0;
        }
    });
});

let prevMainCamDevice = "";
function cameraChanged(newCamDevice : string) : boolean {
    let changed = false;
    if (!newCamDevice || !prevMainCamDevice ||newCamDevice.localeCompare(prevMainCamDevice) === 0) {
        changed = false;
    } else {
        console.log("cam changed");
        changed = true;
    }
    prevMainCamDevice = newCamDevice;
    return changed;
}

client.on("Subdata", function(value : SubData) {
    if(cameraChanged(value.cameraInfos[0].device)){
        view.stop();
        view = new CanvasView(firstCanvas, secondCanvas, thirdCanvas);
        view.start();
    }
    value.missionName = (<any>document.getElementById("mission")).value;
    view.updateData(value);
})

document.onreadystatechange = (e) => {
    window.onbeforeunload = (e) => { 
        // texts don't matter, chrome does not show them
        e.returnValue = 'onbeforeunload';
    return 'onbeforeunload';
    };
};

