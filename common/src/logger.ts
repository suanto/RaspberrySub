"use strict";

export interface ILogger {
    log(severity : string, message : string) : void;
}