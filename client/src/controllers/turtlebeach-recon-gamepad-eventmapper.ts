import { CommandType } from "../../../common/src/command";
import { ICmdSender } from "../interfaces/cmdsender";

export class TurtleBeachReconGamepadEventMapper {

    private coms : ICmdSender;

    constructor (coms : ICmdSender) {
        if (!coms) throw "TurtleBeachReconGamepadEvenmapper: coms not specified";
        
        this.coms = coms;
    }

    public handleDisconnect() : void {
        this.coms.send({cmdType: CommandType.Disarm, value: 0});
    }

    public handleButtonPress(button : number) {
        switch (button) {  
        
            // case 0:
            //     this.coms.send({cmdType: CommandType.Depthlock, value: 0});
            //     break;

            case 0:
                this.coms.send({cmdType: CommandType.Lights, value: -25});
                break;

            case 1:
                this.coms.send({cmdType: CommandType.Lights, value: 25});
                break;

            case 2:
            case 3:
                this.coms.send({cmdType: CommandType.Disarm, value: 0});
                break;
            
            // case 3:
            //     this.coms.send({cmdType: CommandType.HeadingAndSpeedLock, value: 0});
            //     break;

            // case 4:
            //     this.coms.send({cmdType: CommandType.ChangeCamera, value: -1});
            //     break;

            // case 5: 
            //     this.coms.send({cmdType: CommandType.ChangeCamera, value: 1});
            //     break;  

            case 4:
                this.coms.send({cmdType: CommandType.Powerfactor, value: -10});
                break;

            case 5:
                this.coms.send({cmdType: CommandType.Powerfactor, value: 10});
                break;
          
            case 8:
                this.coms.send({cmdType: CommandType.Arm, value: 0});
                break;
        }
    }

    public handleAxisMovement(axis : number, value : number) {
        switch (axis) {
            case 0: // mode-2 yaw
                this.coms.send({cmdType: CommandType.Yaw, value});
                break;

            case 1: // mode-2 throttle
                this.coms.send({cmdType: CommandType.Throttle, value: -value});
                break;
            
            case 3: // mode-2 roll
                this.coms.send({cmdType: CommandType.Roll, value});
                break;
            
            case 4: // mode-2 pitch
                this.coms.send({cmdType: CommandType.Pitch, value: -value});
                break;

            // case 4: // change camera
            //     if (value > 0) {
            //         this.coms.send({cmdType: CommandType.ChangeCamera, value: 1});
            //     } else if (value < 0{
            //         this.coms.send({cmdType: CommandType.ChangeCamera, value: -1});

            //     }
            //     break;

            // case 5: // power factor, invert
            //     if (value > 0) {
            //         this.coms.send({cmdType: CommandType.Powerfactor, value: -10});
            //     } else if (value < 0) {
            //         this.coms.send({cmdType: CommandType.Powerfactor, value: 10});

            //     }
            //     break;
        }
    }
}