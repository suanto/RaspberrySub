"use strict"

import { CameraInfo } from "../../../common/src/data";

export interface ICameraStatusReporter {
    getCameras() : CameraInfo[];
}