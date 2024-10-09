"use strict";

"use strict";
import { each } from "lodash";
// import { CommandType } from "../../../common/src/command";
import { IController } from "../interfaces/controller";
// import { OxtGamepadEventMapper } from "./oxt-gamepad-eventmapper";
import { TurtleBeachReconGamepadEventMapper } from "./turtlebeach-recon-gamepad-eventmapper";

export interface GCOptions {
    pollIntervalMs? : number
}

export class GamepadListener implements IController {
    // to send messages
    private eventMapper : TurtleBeachReconGamepadEventMapper ;

    // browser window to hear
    private window : Window;

    private options : GCOptions;
    private previousState : Gamepad = null;
    private listen : boolean = false;
    private intervalHandle : NodeJS.Timeout = null;

    constructor(window : Window, eventMapper : TurtleBeachReconGamepadEventMapper, options : GCOptions = {pollIntervalMs: 1000}) {
        if (!window) throw "No window set";
        if (!eventMapper) throw "No eventmapper set";
        
        this.window = window;
        this.eventMapper = eventMapper;
        this.options = {...options};
    }

    start(): void {
        this.addListenersToWindow();
        this.listen = true;
    }

    stop(): void {
        this.listen = false;
        this.stopListening();
    }
    
    private addListenersToWindow(): void {
        this.window.addEventListener("gamepadconnected", (e : any) => {
            this.previousState = e.gamepad;
            this.startListening();
          });

        this.window.addEventListener("gamepaddisconnected", () => {
            this.previousState = null;
            this.eventMapper.handleDisconnect();
            this.stopListening();
        });  
    }
   
    private startListening() : void {

        const me = this;
        function readGamepad() {
            if (me.listen) {
                const currState = navigator.getGamepads()[0];
                
                each(currState.axes, (value : number, i) => {
                    if (value !== me.previousState.axes[i]) {
                        // value changed from prev, report
                        me.eventMapper.handleAxisMovement(i, value);
                    }
                })

                each(currState.buttons, (button : GamepadButton, i) => {
                    if (me.previousState.buttons[i].pressed !== button.pressed && button.pressed === true) {
                        // value changed from prev, report
                        me.eventMapper.handleButtonPress(i);
                    }
                })
                me.previousState = currState;
            }
        }

        this.intervalHandle = setInterval(readGamepad, this.options.pollIntervalMs);
    }

    private stopListening() : void {
        clearInterval(this.intervalHandle);
    }
}


