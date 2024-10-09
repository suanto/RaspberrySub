"use strict"
import { exec } from "shelljs";

export class ShutdownHandler {
    public shutdown() : void {
        exec("sudo shutdown -h now");
    }

    public reboot() : void {
        exec("sudo shutdown -r now");
    }
}