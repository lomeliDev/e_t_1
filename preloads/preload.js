const { ipcRenderer } = require('electron');
const SerialPort = require('serialport');
require('./innovative_technology');
require('./leds');
require('./tp');
require('./xc');
require('./generals');

window.a0 = async() => {
    const _ports = [];
    try {
        const serialList = await SerialPort.list();
        for (const k in serialList) {
            const port = serialList[k];
            _ports.push({
                port: port.path,
                name: port.manufacturer === undefined ? '' : port.manufacturer
            });
        }
        return _ports;
    } catch (error) {
        return [];
    }
}

window.version = (setversion) => {
    let version = "Version 0";
    ipcRenderer.send('app_version');
    ipcRenderer.on('app_version', (event, arg) => {
      ipcRenderer.removeAllListeners('app_version');
      version = 'Version ' + arg.version;
      setversion(version);
      console.log(version);
    });
    return version;
}
