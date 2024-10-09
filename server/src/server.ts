"use strict";

const express = require( "express" );
import {createServer} from "http";
import { Server, Socket } from 'socket.io';

import { MjpgCameraHandler } from './camera/camerahandler';
import { ICmdHandler } from './interface/comhandler';
import { MockSubmarine } from './mock/MockSubmarine';
import { SubmarineSerialController } from "./serialcoms/SubmarineSerialController";
import { ServerCmdHandler } from './socketcoms/ServerComHandler';
import { SocketStatusSender } from './socketcoms/socketstatussender';
import { StatusReader } from './socketcoms/statusReader';
import { SerialWriter} from './serialcoms/SerialComsHandler';
import { SubmarineDataReader } from "./serialcoms/SubmarineDataReader";

// set up express and socket.io
const port = process.env.PORT || 5000;
const app = express(); 

const httpServer = createServer(app);
 
const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },
        
    });
app.use(express.static('dist/client/static_files'));
app.use(express.static('dist/client'));

app.get('/', function(req, res) {
    console.log("requested root");
})

const cameraHandler = new MjpgCameraHandler();
let comHandler : ICmdHandler = null;
let statusReader : StatusReader = null;

const subReader = new SubmarineDataReader();
const submarine = new SubmarineSerialController(new SerialWriter("/dev/ttyACM0", subReader));
io.on('connection', function(socket : Socket) {
    console.log('User connected');
    
    cameraHandler.startCameras();

    comHandler = new ServerCmdHandler(socket, cameraHandler, submarine);
    comHandler.start();

    statusReader = new StatusReader(new SocketStatusSender(socket), cameraHandler, subReader);
    statusReader.start();

});

io.on('disconnect', function() {
    cameraHandler.stopCameras();
    comHandler.stop();
    statusReader.stop();
});

httpServer.listen(port);
console.log("hello");

