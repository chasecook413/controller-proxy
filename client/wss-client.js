const WebSocket = require('ws');
const winston = require('winston');
const joystick = require('joystick');
const util = require('util');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.timestamp(),
    defaultMeta: { service: 'controller-server' },
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    ],
});

const ws = new WebSocket('ws://192.168.1.67:8080');

function onButton(button) {
    // logger.info(`Received button: ${util.inspect(button)}`);
    // logger.info(typeof button);
    ws.send(Buffer.from(JSON.stringify(button)));
}

function onAxis(axis) {
    // logger.info(`Received axis event: ${util.inspect(axis)}`);
    // logger.info(typeof axis);
    ws.send(Buffer.from(JSON.stringify(axis)));
}

ws.on('open', function open() {
    logger.info('WebSocket connection open, connecting controller');
    const controller = new joystick(0, 3500, 350);
    controller.on('ready', () => { logger.info('Controller connected.')});
    controller.on('button', onButton);
    controller.on('axis', onAxis);
});
