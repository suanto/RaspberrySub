"use strict"
import { SubData, DataMessage } from "../../../common/src/data";
import { IStatusSender } from "../interface/statussender";
import { Socket } from "socket.io";

export class SocketStatusSender implements IStatusSender {

    private socket : Socket;

    constructor(socket : Socket) {
        if (!socket) throw "socket unset";

        this.socket = socket;
    }

    send(msg: DataMessage ): void {
        this.socket.emit(msg.cmdType, msg.message);
    }

}