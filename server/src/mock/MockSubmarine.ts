"use strict"

import { SubData } from "../../../common/src/data";
import { ISubmarineController } from "../interface/ISubmarineController";
import { ISubmarineDataReader } from "../interface/ISubmarineDataReader";

import { default as clamp } from "lodash/clamp";
import { default as round } from "lodash/round";

const FORCE_SAFE_STATE_TIMEOUT_MS = 2500;

export class MockSubmarine implements ISubmarineController, ISubmarineDataReader {

    private state : SubData;
    private lastHeartbeatTime : number = 0;
    private activeLight = 0;

    constructor() {
        this.state = this.startingState();
        this.lastHeartbeatTime = Date.now();
    }
    setData(data: string): void {
        throw new Error("Method not implemented.");
    }

    powerfactor(factor: number) {
        let newFactor = this.state.power_factor += factor > 0 ? 0.1 : -0.1;
        newFactor = clamp(newFactor, 0.1, 1);
        this.state.power_factor = round(newFactor, 1); 
    }

    private startingState() : SubData {
        return {
            armed: false,
            current: 0.5,
            depth: 0,
            engine_speed: [0,0,0,0,0,0],
            light_intensity: [0,0,0],
            voltage: 16.0,
            power_factor: 0.3
        }
    }

    arm(): void {
        this.state.armed = true;
    }

    disarm(): void {
        this.state.armed = false;
        this.state.engine_speed = [0,0,0,0,0,0];
    }

    throttle(power: number): void {
        if (!this.state.armed) return;

        this.state.depth += power > 0 ? 1 : -1; // add or take meter
        this.state.engine_speed[0] = power * this.state.power_factor;
        this.state.engine_speed[1] = power * this.state.power_factor;
    }

    yaw(power: number): void {
        if (!this.state.armed) return;

        this.state.engine_speed[2] = power * this.state.power_factor;
        this.state.engine_speed[3] = -power * this.state.power_factor;
    }

    pitch(power: number): void {
        if (!this.state.armed) return;

        this.state.engine_speed[2] = power * this.state.power_factor;
        this.state.engine_speed[3] = power * this.state.power_factor;
    }

    roll(power: number): void {
        if (!this.state.armed) return;

        this.state.engine_speed[4] = power * this.state.power_factor;
        this.state.engine_speed[5] = power * this.state.power_factor;
    }

    activate_light(light: number): void {
        this.activeLight += (+light);
        if (this.activeLight >= this.state.light_intensity.length) {
            this.activeLight = 0;
        } else if (this.activeLight < 0) {
            this.activeLight = this.state.light_intensity.length - 1;
        } else {
            // ok
        }
    }

    change_light_intensity(intensity: number): void {
        let newIntensity = this.state.light_intensity[this.activeLight] + (+intensity/100);
        newIntensity = clamp(newIntensity, 0,1);
        this.state.light_intensity[this.activeLight] = newIntensity;
    }

    heartbeat(i: number): void {
        console.log("sub rc hb: " + i + " : " + (Date.now() - this.lastHeartbeatTime) + "ms" );
        this.lastHeartbeatTime = Date.now();
    }

    getData(): SubData {
        if (Date.now() - this.lastHeartbeatTime >= FORCE_SAFE_STATE_TIMEOUT_MS && this.state.armed) {
            this.state.armed = false;
            console.log("heartbeat timeout : disarm");
        }
        return this.state;
    }

    

}