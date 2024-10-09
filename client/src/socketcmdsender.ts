"use strict";

import { ICmdSender } from "./interfaces/cmdsender";
import { Command } from "../../common/src/command";
import { toString } from "lodash-es";
import { io } from "socket.io-client";

export class SocketCmdSender implements ICmdSender {
    // constructor (socket)
    private socket : io;

    constructor(socket : io) {
        if (!socket) throw "socket unset";

        this.socket = socket;
    }

    send(msg : Command) : void {
        this.socket.emit(msg.cmdType, toString(msg.value));
    }
}