"use strict";
import { Command } from "../../../common/src/command";

export interface ICmdSender {
    // constructor (socket)
    send(msg : Command) : void;
}