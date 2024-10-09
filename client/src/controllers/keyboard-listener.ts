// change camera (c)
// more light / less light (page up / page down)
// throttle + / - (ctrl/alt/shift + arrow up / ctrl + arrow down)
// yaw + / - (arrow right / arrow left)
// pitch + / -  (ctrl/alt/shift + arrow up / ctrl + arrow down)
// roll + / - ( arrow up / arrow down)
// power + / - ( plus / minus)
// arm / disarm ( esc / space )
// all of (x) = disarm & lights off

import { clamp } from "lodash";
import { CommandType } from "../../../common/src/command";
import { ICmdSender } from "../interfaces/cmdsender";
import { IController } from "../interfaces/controller";

const increment = 0.1;

export class KeyboardListener implements IController {
    private started : boolean = false;
    private coms : ICmdSender = null;

    private throttle = 0;
    private yaw = 0;
    private pitch = 0;
    private roll = 0;

    constructor(doc : Document, coms : ICmdSender) {
        if (!doc || !coms) throw "Coms or doc not given";

        this.coms = coms;
        doc.addEventListener("keyup", (event : KeyboardEvent) => {
            if (!this.started)  return;
            switch (event.key) {
                case 'ArrowUp':
                    if (event.shiftKey || event.ctrlKey || event.altKey) {
                        this.throttle += increment;
                        this.throttle = clamp(this.throttle, -1, 1);
                        this.coms.send({cmdType: CommandType.Throttle, value: this.throttle});    
                    } else {
                        this.pitch += increment;
                        this.pitch = clamp(this.pitch, -1, 1);
                        this.coms.send({cmdType: CommandType.Pitch, value: this.pitch}); 
                    }
                    break;

                case 'ArrowDown':
                    if (event.shiftKey || event.ctrlKey || event.altKey) {
                        this.throttle -= increment;
                        this.throttle = clamp(this.throttle, -1, 1);
                        this.coms.send({cmdType: CommandType.Throttle, value: this.throttle});    
                    } else {
                        this.pitch -= increment;
                        this.pitch = clamp(this.pitch, -1, 1);
                        this.coms.send({cmdType: CommandType.Pitch, value: this.pitch});    
                    }
                    break;

                case 'ArrowLeft':
                    if (event.shiftKey || event.ctrlKey || event.altKey) {
                        this.roll -= increment;
                        this.roll = clamp(this.roll, -1, 1);
                        this.coms.send({cmdType: CommandType.Roll, value: this.roll});    
                    } else {
                        this.yaw -= increment;
                        this.yaw = clamp(this.yaw, -1, 1);
                        this.coms.send({cmdType: CommandType.Yaw, value: this.yaw});    
                    }
                    break;

                case 'ArrowRight':
                    if (event.shiftKey || event.ctrlKey || event.altKey) {
                        this.roll += increment;
                        this.roll = clamp(this.roll, -1, 1);
                        this.coms.send({cmdType: CommandType.Roll, value: this.roll});    
                    } else {
                        this.yaw += increment;
                        this.yaw = clamp(this.yaw, -1, 1);
                        this.coms.send({cmdType: CommandType.Yaw, value: this.yaw});    
                    }
                    break;

                case 'Escape':
                    this.coms.send({cmdType: CommandType.Disarm, value : 0});
                    this.pitch = this.throttle = this.yaw = this.roll = 0;
                    break;
                case 'x':
                    this.coms.send({cmdType: CommandType.Disarm, value : 0});
                    this.pitch = this.throttle = this.yaw = this.roll = 0;

                    this.coms.send({cmdType: CommandType.Lights, value: -100});
                    this.coms.send({cmdType: CommandType.ChangeCamera, value : 1})
                    this.coms.send({cmdType: CommandType.Lights, value: -100});
                    this.coms.send({cmdType: CommandType.ChangeCamera, value : 1})
                    this.coms.send({cmdType: CommandType.Lights, value: -100});
                    this.coms.send({cmdType: CommandType.ChangeCamera, value : 1})
                    break;

                case 'c':
                    this.coms.send({cmdType: CommandType.ChangeCamera, value : 1})
                    break;

                case 'PageUp':
                    this.coms.send({cmdType: CommandType.Lights, value: 10});
                    break;

                case 'PageDown':
                    this.coms.send({cmdType: CommandType.Lights, value: -10});
                    break;
                
                case '+':
                    this.coms.send({cmdType: CommandType.Powerfactor, value: 10});
                    break;

                case '-':
                    this.coms.send({cmdType: CommandType.Powerfactor, value: -10});
                    break;
                    
                case ' ':
                    this.coms.send({cmdType: CommandType.Arm, value : 0});
                    break;
            }
            
        })
    }
    start(): void {
        this.started = true;
    }

    stop(): void {
        this.started = false;
    }

}