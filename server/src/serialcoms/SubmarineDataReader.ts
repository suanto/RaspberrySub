"use strict"

import { ISubmarineDataReader } from "../interface/ISubmarineDataReader";
import { SubData } from "../../../common/src/data";
import { startsWith } from "lodash";

export class SubmarineDataReader implements ISubmarineDataReader {
    private data : string;
    private prvParsedData : SubData = { armed: false};
    private i : number = 0;

    public setData(data : string) : void {
        if (this.i++ % 20 == 1 || !startsWith(data, "{")) {
            // log every nth and err msgs
            console.log(data);
        }

        if (data && data.length> 20) {
            this.data = data;
        }
    }

    public getData() : SubData  {
        const parsedData = this.parseData();
        if (parsedData) {
            this.prvParsedData = parsedData;
        }

        return this.prvParsedData;
    }

    private parseData() : SubData {
        if  (!this.data) return null;
        let dataJson; 
        try {
            dataJson = JSON.parse(this.data);
        } catch (e) {
            console.log("error parsing submessage: ", this.data);
            return null;
        }
        const retVal : SubData = {
            armed : dataJson.armed,
            depth : dataJson.depth,
            tempIn : dataJson.temperature_in,
            tempOut : dataJson.temperature_out,
            heading : dataJson.heading,
            pitch : dataJson.pitch,
            roll : dataJson.roll,
            current : dataJson.current,
            voltage : dataJson.voltage,
            light_intensity : dataJson.lightIntensities,
            engine_speed: dataJson.enginePowers,
            power_factor : dataJson.powerfactor,
            
        }
        return retVal;
    }
}