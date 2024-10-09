"use strict";

import { CommandType } from "../../../common/src/command";
import { ICmdSender } from "../interfaces/cmdsender";
import { IController } from "../interfaces/controller";

export interface HeartBeatOptions {
    intervalMs : number
}
export class HeartBeat implements IController {

    private options : HeartBeatOptions;
    private coms : ICmdSender;
    private intervalHandle : NodeJS.Timeout = null;
    private i : number = 0;
a
    constructor(coms : ICmdSender,options : HeartBeatOptions = { intervalMs : 1000 }) {
        this.options = options;
        this.coms = coms;
    }
    
    start(): void {
        const me = this;
        function sendHeartBeat() {
            me.coms.send({cmdType: CommandType.Heartbeat, value: me.i++})
        }

        if (!this.intervalHandle) {
            this.intervalHandle = setInterval(sendHeartBeat, this.options.intervalMs);
        } else {
            throw "Heartbeat already started";
        }

    }
    stop(): void {
        if (this.intervalHandle) {
            clearInterval(this.intervalHandle);
            this.intervalHandle = null;
        }
    }
    
}