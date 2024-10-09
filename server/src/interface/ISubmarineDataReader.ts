"use strict"

import { SubData } from "../../../common/src/data";

export interface ISubmarineDataReader {
    setData(data : string) : void;
    getData() : SubData; 
}