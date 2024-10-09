"use strict"

import { Command } from "../../../common/src/command";

export interface ICommandSender {
    sendCommand(message : string) : void;
}