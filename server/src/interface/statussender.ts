"use strict"

import { DataMessage } from "../../../common/src/data";

export interface IStatusSender {
    send(msg : DataMessage) : void;
}