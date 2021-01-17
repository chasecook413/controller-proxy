const WebSocket = require('ws');
const controller = require('./controller');
const winston = require('winston');

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

const controllers = [];
const wss = new WebSocket.Server({ port: 8080 });

wss.on('listening', function() {
    // console.log('Listening')
    logger.info('Listening');
});

wss.on('close', function() {
    logger.info('Closing server');
});

wss.on('connection', function connection(ws) {
    logger.info(`WS connected: ${ws.address}`);
    const c = new controller.Controller(ws, logger);
    controllers.push(c);
});

process.on('exit', function() {
    controllers.forEach(c => {
        c.close();
    });

    wss.close();
});