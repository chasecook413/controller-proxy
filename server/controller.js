const ViGEmClient = require('vigemclient');
const fs = require('fs');
const buttonMap = JSON.parse(fs.readFileSync('./button-map.json').toString());

class Controller {
    constructor(ws, logger) {
        this.ws = ws;
        this.ws.on('message', this.onMessage.bind(this));
        this.ws.on('close', this.close.bind(this));
        this.logger = logger;

        this.viGEmclient = new ViGEmClient();
        this.viGEmclient.connect(); // establish connection to the ViGEmBus driver
        this.controller = this.viGEmclient.createX360Controller();
        this.controller.connect(); // plug in the virtual controller

        this.logger.debug('Controller connected');
    }

    onMessage(message) {
        // this.logger.info(`Received message: ${message}`);
        message = JSON.parse(message.toString());
        switch (message.type) {
            case 'button':
                this.handleButton(message);
                break;
            case 'axis':
                this.handleAxis(message);
                break;
            default:
                this.logger.error('unknown even type!', message.type);
        }
    }

    handleButton(buttonEvent) {
        // this.logger.info(`Button Event ${buttonEvent.number} mapped to ${buttonMap.button[buttonEvent.number]}`);
        // this.logger.info(`Assigning value: ${buttonEvent.value}`);
        this.controller.button[buttonMap.button[buttonEvent.number]].setValue(buttonEvent.value);
    }

    handleAxis(axisEvent) {
        // this.logger.info(`Axis Event ${axisEvent.number} mapped to ${buttonMap.axis[axisEvent.number]}`);
        // this.logger.info(`Assigning value: ${axisEvent.value}`);
        let axis = buttonMap.axis[axisEvent.number];

        // server-side lib uses percentages, so dividing by max
        axisEvent.value = axisEvent.value / 35000;

        if ([1, 4, 7].indexOf(axisEvent.number) > -1) {
            // seeing they are inverted between libraries
            axisEvent.value = -1 * axisEvent.value;
        }

        // this.logger.info(`Axis is actually: ${axis}`);
        // this.logger.info(`Percentage is: ${axisEvent.value}`);
        this.controller.axis[axis].setValue(axisEvent.value);
    }

    close() {
        this.logger.info('Disconnecting controller');
        this.controller.disconnect();
    }
}

module.exports = {
    Controller,
}
