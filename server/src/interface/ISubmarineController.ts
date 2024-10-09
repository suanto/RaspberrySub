"use strict"

export interface ISubmarineController {
    arm() : void;
    disarm() : void;

    // positive up, negative down
    throttle(power : number) : void;

    // positive right, negative down
    yaw(power : number) : void;

    // positive forward, negative backwards
    pitch(power : number) : void;

    // positive right, negative left
    roll(power : number) : void;

    // negative previous, positive next
    activate_light(light : number) : void;
    change_light_intensity(intensity : number) : void;

    heartbeat(i : number) : void;

    powerfactor(factor : number);
}