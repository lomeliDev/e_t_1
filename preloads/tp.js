const SerialPort = require('serialport');

window.a4 = async() => {
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
