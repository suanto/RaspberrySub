"use strict"

export enum DataMessageType {
    Subdata = "Subdata"
}

export interface CameraInfo {
    name : string;
    width : number;
    height : number;
    device: string;
}

export interface SubData {
    depth? : number,
    tempIn? : number,
    tempOut? : number,
    heading? : number,
    pitch? : number,
    roll? : number,
    
    armed : boolean;
    
    // 0-1
    engine_speed? : number[];

    // 0-1
    power_factor? : number;

    // 0-1
    light_intensity? : number[];

    // electricity
    voltage? : number;
    current? : number;

    // cams
    cameraInfos? : CameraInfo[];

    // ui stuff
    missionName? : string;
    
}

export interface DataMessage {
    cmdType : DataMessageType,
    message : SubData
}