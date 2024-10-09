"use strict"

import {default as SerialPort} from "serialport";
import { ICommandSender } from "../interface/ICommandSender";
import { ISubmarineDataReader } from "../interface/ISubmarineDataReader";
import {startsWith} from "lodash";
export class SerialWriter implements ICommandSender {

    private serialPort : SerialPort;
    private subdataReader : ISubmarineDataReader;
    constructor(port : string, subDatareader : ISubmarineDataReader) {
        if (!port) throw "SubmarineSerialController: no port";
        this.subdataReader = subDatareader;

        try {
            this.serialPort = new SerialPort(port, {
                baudRate: 115200,
            });
        } catch (e) {
            console.error("Serial port can't be opened!");
        }

        // Open errors will be emitted as an error event
        this.serialPort.on('error', function(err) {
            console.log('Error: ', err.message)
        })

        const parser = new SerialPort.parsers.Readline({delimiter: "\n"});
        
        if (this.serialPort) this.serialPort.pipe(parser);
        
        const me = this;
        parser.on('data', function(line) {
            if (line && startsWith(line, "DEBUG")) console.log(line);
            else if (me.subdataReader) me.subdataReader.setData(line);
            // console.log(line);
        });
    }
    public sendCommand(message : string) : void {
        // console.log("writing serial: " + message);
        if (this.serialPort) this.serialPort.write(message + '\n', function(err) {
            if (err) {
              return console.log('Error on write: ', err.message)
            }
            console.log('message written: ' + message);
        })
    }
};