"use strict"

import { SubData } from "../../../common/src/data";
import { get, each, round, isUndefined } from "lodash-es";

const FPS = 25;
const TEXT_START_X = 0;
const TEXT_START_Y = 400;

const TAB_1_X = 0;
const TAB_2_X = 1280 / 2;
const TAB_3_X = 1280 - 200;

const ROW_MARGIN = 2;
const ROW_HEIGHT = 16;
const ROW_1_Y = ROW_HEIGHT;
const ROW_2_Y = (2 * ROW_HEIGHT) + ROW_MARGIN;
const ROW_3_Y = (3 * ROW_HEIGHT) + (2 * ROW_MARGIN);

export class CanvasView {
    private firstCanvas : HTMLCanvasElement;
    private firstContext : CanvasRenderingContext2D;

    private secondCanvas : HTMLCanvasElement;
    private secondContext : CanvasRenderingContext2D;

    private thirdCanvas : HTMLCanvasElement;
    private thirdContext : CanvasRenderingContext2D;

    private data : SubData;
    private intervalHandle : NodeJS.Timeout;
    private dataY : number = 0;
    private running = false;
    private connectedToRaspberry : boolean = false;
    private connectedToArduino : boolean =  false;
    private lastMsgFromArduino : number = 0;
    private connectedToCam1 : boolean = false;
    private connectedToCam2 : boolean = false;
    private connectedToCam3 : boolean = false;


    constructor(firstCanvas : HTMLCanvasElement, secondCanvas : HTMLCanvasElement, thirdCanvas : HTMLCanvasElement) {
        if (!firstCanvas || !secondCanvas || !thirdCanvas) throw "Canvasview: context not set";

        this.firstCanvas = firstCanvas;
        firstCanvas.width = 1280;
        firstCanvas.height = 720 ;
        this.firstContext = firstCanvas.getContext('2d');

        this.secondCanvas = secondCanvas;
        secondCanvas.width = 1280;
        secondCanvas.height = 720 ;
        this.secondContext = secondCanvas.getContext('2d');

        this.thirdCanvas = thirdCanvas;
        thirdCanvas.width = 1280;
        thirdCanvas.height = 720 ;
        this.thirdContext = thirdCanvas.getContext('2d');

        this.data = this.defaultData();
    }


    private defaultData() : SubData {
        return {
            armed: false,
            current: 0,
            depth: 0,
            engine_speed: [0],
            light_intensity: [0],
            voltage: 0
        }
    }

    public start() {

        this.running = true;
        const me = this;
        let firstCam;
        let secondCam;
        let thirdCam;

        function loadCam1() {
            firstCam = new Image();

            function retry() {
                if (!me.connectedToCam1) loadCam1();
            }
            
            firstCam.onload = function() {
                me.connectedToCam1 = true;                
            }

            firstCam.error = function() {
                console.log("Cam1 - error : tring out in few secs");
                me.connectedToCam1 = false;
                loadCam1();
            }

            firstCam.src = "http://192.168.3.3:8080/?action=stream_0";
            firstCam.crossOrigin = "Anonymous";  // cors requires

            setTimeout(retry, 3000);
            
        }

        function loadCam2() {
            secondCam = new Image();

            function retry() {
                if (!me.connectedToCam2) loadCam2();
            }
            
            secondCam.onload = function() {
                me.connectedToCam2 = true;
            }

            secondCam.error = function() {
                console.log("Cam2 - error : tring out in few secs");
                me.connectedToCam2 = false;
                loadCam2();
            }

            secondCam.src = "http://192.168.3.3:8080/?action=stream_1";
            secondCam.crossOrigin = "Anonymous";

            setTimeout(retry, 3000);
            
        }

        function loadCam3() {
            thirdCam = new Image();

            function retry() {
                if (!me.connectedToCam3) loadCam3();
            }
            
            thirdCam.onload = function() {
                me.connectedToCam3 = true;
                
            }

            thirdCam.error = function() {
                console.log("Cam3 - error : tring out in few secs");
                me.connectedToCam3 = false;
                loadCam3();
            }

            thirdCam.src = "http://192.168.3.3:8080/?action=stream_2";
            thirdCam.crossOrigin = "Anonymous";

            setTimeout(retry, 3000);
            
        }

        function draw() {
            me.checkConnections();
            me.dataY = TEXT_START_Y;
            //me.clearView();
            
            // draw cams if picture coming
            if (me.connectedToCam1)  me.drawCam(firstCam, me.firstContext, get(me, "data.cameraInfos[0].name", ""));
            if (me.connectedToCam2)  me.drawCam(secondCam, me.secondContext, get(me, "data.cameraInfos[1].name", ""));
            if (me.connectedToCam3)  me.drawCam(thirdCam, me.thirdContext, get(me, "data.cameraInfos[2].name", ""));

            me.drawCrosshair(me.firstContext);
            me.drawCrosshair(me.secondContext);
            me.drawCrosshair(me.thirdContext);

            me.drawMissionName(me.firstContext);
            me.drawMissionName(me.secondContext);
            me.drawMissionName(me.thirdContext);
            me.dataY += 16;

            me.drawDate(me.firstContext);
            me.drawDate(me.secondContext);
            me.drawDate(me.thirdContext);
            me.dataY += 20;

            me.drawArmState(me.firstContext);
            me.drawArmState(me.secondContext);
            me.drawArmState(me.thirdContext);
            me.dataY += 20;

            me.drawDepth(me.firstContext);
            me.drawDepth(me.secondContext);
            me.drawDepth(me.thirdContext);
            me.dataY += 20;

            me.drawTemp(me.firstContext);
            me.drawTemp(me.secondContext);
            me.drawTemp(me.thirdContext);
            me.dataY += 20;

            me.drawVoltAndAmps(me.firstContext);
            me.drawVoltAndAmps(me.secondContext);
            me.drawVoltAndAmps(me.thirdContext);
            me.dataY += 20;

            me.drawHeadingAndPosition(me.firstContext);
            me.drawHeadingAndPosition(me.secondContext);
            me.drawHeadingAndPosition(me.thirdContext);
            me.dataY += 20;

            me.drawLightStates(me.firstContext);
            me.drawLightStates(me.secondContext);
            me.drawLightStates(me.thirdContext);
            me.dataY += 20;

            me.drawEngines(me.firstContext);
            me.drawEngines(me.secondContext);
            me.drawEngines(me.thirdContext);
            me.dataY += 20;

            me.drawPowerfactor(me.firstContext);
            me.drawPowerfactor(me.secondContext);
            me.drawPowerfactor(me.thirdContext);
            me.dataY += 20;

            me.drawConnections(me.firstContext);
            me.drawConnections(me.secondContext);
            me.drawConnections(me.thirdContext);
            me.dataY += 20;

            if (me.running) {
                setTimeout(draw, 1000/FPS);
            }
        }

        this.drawPlaceholders(this.firstContext);
        this.drawPlaceholders(this.secondContext);
        this.drawPlaceholders(this.thirdContext);
        
        loadCam1();
        loadCam2();
        loadCam3();
        if (me.running) {
            setTimeout(draw, 1000/FPS);
        }
    }

    private drawPlaceholders(context : CanvasRenderingContext2D) : void {
        const prvFill =  context.fillStyle;
        
        // maincam
        context.fillStyle = 'green';
        context.fillRect(0, 0, 1280, 720);

        // 2nd
        context.fillStyle = 'blue';
        context.fillRect(1280, 0, 1280, 720);

        // 3rd
        context.fillStyle = 'yellow';
        context.fillRect((2*1280), 0, 1280, 720);

        // data
        // context.fillStyle = 'white';
        // context.fillRect((3*1280), 0, 1280, 720);
    
        context.fillStyle = prvFill;
    }
    
    private drawCam(image : HTMLImageElement, context : CanvasRenderingContext2D, name : string) : void {
        // if (!this.connectedToCam1) {
        //     context.fillStyle = 'green';
        //     context.fillRect(0, 0, 1280, 720);
        // } else {
            try {
                context.drawImage(image, 0, 0, 1280, 720);
            } catch (e) {
                // start gives broken images, never mind
            }

            // if (this.data && this.data.cameraInfos && this.data.cameraInfos[0] && this.data.cameraInfos[0].name) {
                context.font = '16pt Arial';
                context.lineWidth = 1;
                context.fillStyle = "white";
                context.fillText( name || "", TAB_1_X, ROW_1_Y);
            // }    
        // }
    }

    private drawMissionName(context : CanvasRenderingContext2D) {
        context.font = '16pt Arial';
        context.lineWidth = 1;
        context.fillStyle = "white";
        context.fillText( document.getElementById("mission").value, TAB_2_X, ROW_1_Y);
    }
    
    private drawArmState(context : CanvasRenderingContext2D) {
        context.font = '16pt Arial';
        context.lineWidth = 1;
        context.fillStyle = "white";
        const text = this.data.armed ? "Armed" : "Disarmed";
        context.fillText( this.connectedToArduino ? text : "-", TAB_1_X, ROW_2_Y);    
    }
    
    private drawCrosshair(context : CanvasRenderingContext2D) {
        const lineLength = 100;
        const mainCamWidth = 1280;
        const mainCamHeight = 720;

        const prevFillStyle = context.fillStyle;

        // horizontal line
        context.strokeStyle = "white";
        context.beginPath();
        context.moveTo((mainCamWidth/2) - (lineLength / 2), (mainCamHeight / 2));
        context.lineTo((mainCamWidth / 2) + (lineLength / 2), (mainCamHeight / 2));
        context.closePath();
        context.stroke();

        // vertical line
        context.strokeStyle = "white";
        context.beginPath();
        context.moveTo((mainCamWidth/2), (mainCamHeight / 2) - (lineLength / 2));
        context.lineTo((mainCamWidth / 2), (mainCamHeight / 2) + (lineLength / 2));
        context.closePath();
        context.stroke();
        

        // restore style
        context.fillStyle = prevFillStyle;
    }

    private drawDepth(context : CanvasRenderingContext2D) {
        context.font = '16pt Arial';

        context.lineWidth = 1;
        context.fillStyle = "white";
        context.fillText( "Depth: " + (this.connectedToArduino ? this.numberToOurFormat(this.data.depth) : "") + "m", TAB_2_X, ROW_2_Y);
    }

    private drawTemp(context : CanvasRenderingContext2D) {
        if (this.data) {
            const text = "(o/i): " + (this.data.tempOut ? this.numberToOurFormat(this.data.tempOut) : "-1") + "C / " +
                (this.data.tempIn ? this.numberToOurFormat(this.data.tempIn) : "-1") + "C";


            context.font = '16pt Arial';
            context.lineWidth = 1;
            context.fillStyle = "white";
            context.fillText( this.connectedToArduino ? text : "(o/i): ", TAB_2_X, ROW_3_Y);
        }
    }
    
    private drawVoltAndAmps(context : CanvasRenderingContext2D) {
        context.font = '16pt Arial';
        const text = this.numberToOurFormat(this.data.voltage) + "v/"
            + this.numberToOurFormat(this.data.current) + "a";

        context.lineWidth = 1;
        context.fillStyle = "white";
        context.fillText((this.connectedToArduino ? text : " v/a"), TAB_1_X, ROW_3_Y);    
    }
    
    private drawEngines(context : CanvasRenderingContext2D) {


        // horizontal line, boxes up/down from thi
        const left_margin = 10, bottom_margin = 10;

        const box_w = 20;
        const box_h = 40;
        const length = 2 * box_w + (get(this, "data.engine_speed.length", 0) * box_w); // add some space to both ends
        const y_base = 720 - bottom_margin - box_h;
        context.beginPath();
        context.moveTo(left_margin, y_base ); // box left side center
        context.lineTo(left_margin + length, y_base)  // box right side center
        context.stroke();

        let x = left_margin;

        // engine powers
        if (this.data && this.data.engine_speed && this.connectedToArduino) {
            each(this.data.engine_speed, (speed : number) => {
                x += box_w;
                if (speed === 0) return;
                const height = speed * box_h; // can be positive or negative
                const y = height > 0 ? (y_base - height) : y_base; // bar must start or end at the base, depending on height
                context.strokeRect(x,y,box_w, Math.abs(height));
                
            });
        }        
    }

    private drawPowerfactor(context : CanvasRenderingContext2D) : void {
        if (this.data && this.data.power_factor) {
            const text = this.data.power_factor * 100 + " %";

            context.font = '14pt Arial';

            context.lineWidth = 1;
            context.fillStyle = "white";
            context.fillText( this.connectedToArduino ? text : " ", 135, 675);
        }
    }

    private drawConnections(context : CanvasRenderingContext2D) : void {
        const text = "Conn: " + 
            (this.connectedToRaspberry ? "R" : "") +
            (this.connectedToArduino ? "A" : "") +
            (this.connectedToCam1 ? "1" : "") +
            (this.connectedToCam2 ? "2" : "") +
            (this.connectedToCam3 ? "3" : "");


        context.font = '16pt Arial';

        context.lineWidth = 1;
        context.fillStyle = "white";
        context.fillText( text, 1280 - 200, 2*16);
    }
    
    private drawHeadingAndPosition(context : CanvasRenderingContext2D) {
        if (this.data) {
            const text = "Hdg: " + (!isUndefined(this.data.heading) ? (this.numberToOurFormat(this.data.heading)) : "-1");

            context.font = '16pt Arial';

            context.lineWidth = 1;
            context.fillStyle = "white";
            context.fillText( text , TAB_3_X, ROW_3_Y);
        }
    }

    private drawLightStates(context : CanvasRenderingContext2D) {

        // draw center line
        const left_margin = 200;
        const bottom_margin = 50;
        const box_w = 20;
        const box_h = 40;
        const length = 2 * box_w + (get(this, "data.light_intensity.length", 0) * box_w); // add some space to both ends
        const y_base = 720 - bottom_margin;

        context.beginPath();
        context.moveTo(left_margin, y_base ); // box left side center
        context.lineTo(left_margin + length, y_base)  // box right side center
        context.stroke();

        // light powers
        let x = left_margin;
        if (this.data && this.data.light_intensity && this.connectedToArduino) {
            each(this.data.light_intensity, (intensity : number) => {
                x += box_w;
                if (intensity === 0) return;
                const height = intensity * box_h; 
                const y = height > 0 ? (y_base - height) : y_base; // can't actually be negative, but works even then
                context.strokeRect(x,y,box_w, Math.abs(height));
            });
        }        
        // let text = "Light: ";

        // if (this.data && this.data.light_intensity && this.connectedToArduino) {

        //     each(this.data.light_intensity, (intensity : number) => {
        //         text += this.numberToOurFormat(intensity, 1) + " ";
        //     });
        // }
        //     context.font = '16pt Arial';

        //     context.lineWidth = 1;
        //     context.fillStyle = "black";
        //     context.fillText( text , TEXT_START_X, this.dataY);
        
    }

    public stop() {
        if (this.intervalHandle) {
            clearInterval(this.intervalHandle);
            this.intervalHandle = null;
        }
        this.running = false;
    }

    public updateData(data : SubData) {
        if (!data) throw ("no data given");
        this.data = data;
        this.lastMsgFromArduino = Date.now();
    }

    private checkConnections() : void {
        this.connectedToRaspberry = this.lastMsgFromArduino + 2000 > Date.now();
        this.connectedToArduino = (this.connectedToRaspberry && 
            !isUndefined(this.data.engine_speed));
        
    }

    private hasCamerasChanged(prev : SubData, current : SubData) : boolean {
        if (!prev || !current) return false;

        if (prev.cameraInfos && current.cameraInfos) {
            return prev.cameraInfos[0].device.localeCompare(current.cameraInfos[0].device) !== 0; 
        }
        return false;
    }

    private clearView() : void {
        this.firstContext.clearRect(0, 0, this.firstCanvas.width, this.firstCanvas.height);
        this.secondContext.clearRect(0, 0, this.secondCanvas.width, this.secondCanvas.height);
        this.thirdContext.clearRect(0, 0, this.thirdCanvas.width, this.thirdCanvas.height);

    }

    private drawDate(context : CanvasRenderingContext2D) : void {
        var today=new Date();
        Date.now();
        context.font = '16pt Arial';
        context.lineWidth = 1;
        context.fillStyle = "white";
        context.fillText( today.toLocaleDateString("FI")+" "+today.toLocaleTimeString("FI"), 1280 - 200, 16);
    }

    private numberToOurFormat(a : number, decimals : number = 2) : string {
        return round(a, decimals).toFixed(decimals);
    }
}