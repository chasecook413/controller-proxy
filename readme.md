
## Controller-Proxy

A proxy for using an Xbox Controller through your Raspberry Pi

### Dependencies:

* NodeJS
* Raspberry Pi (tested with Pi 4)
* PC (tested with Windows 10)

The PC and Pi must be on the same LAN, and you should take note of the local IP of your PC where the server will run.

### Setup/Running:

On your PC `/server`:

    npm install
    node server/wss-server.js

On your Pi `/client`:

    npm install
    PC_IP=<serverpc> node client/wss-client.js

Then plug your Xbox controller into your Pi. The client should pick up on the connection immediately, and your PC should register a controller plugged in as well. Enjoy!

### TODO

* Test multiple controllers
* Automated binary builds for ARM/Windows
