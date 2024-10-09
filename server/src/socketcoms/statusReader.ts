"use strict"

import { SocketStatusSender } from "./socketstatussender";
import { DataMessageType } from "../../../common/src/data";
import { ICameraStatusReporter } from "../interface/CameraStatusReporter";
import { ISubmarineDataReader } from "../interface/ISubmarineDataReader";

// todo: put behind interface
export class StatusReader {
    private sender : SocketStatusSender;
    private intervalHandle : NodeJS.Timeout = null;
    private camReporter : ICameraStatusReporter = null;
    private submarine : ISubmarineDataReader = null;

    constructor (sender : SocketStatusSender, camReporter : ICameraStatusReporter, submarine : ISubmarineDataReader) {
        if (!sender) throw "StatusReader: socket not set";
        if (!camReporter) throw "StatusReader: cameraReporter not set";
        if (!submarine) throw "StatusReader: submarine not set";

        this.sender = sender;
        this.camReporter = camReporter;
        this.submarine = submarine;
    }

    public start() {
        const me = this;

        function pollAndSendData() {
            const data = me.submarine.getData();
            // console.log(data);
            data.cameraInfos = me.camReporter.getCameras();
            me.sender.send({
                cmdType: DataMessageType.Subdata, 
                message: data
            });
        }

        this.intervalHandle = setInterval(pollAndSendData, 2000);
    }

    public stop() {
        if (this.intervalHandle) {
            clearInterval(this.intervalHandle);
            this.intervalHandle = null;
        }
    }
}