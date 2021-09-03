import React, { useState, useEffect } from "react";
const { ipcRenderer } = require('electron');


function App() {
  const [ports, setports] = useState([]);
  const [version, setversion] = useState("");
  const notification = document.getElementById('notification');
  const message = document.getElementById('message');
  const restartButton = document.getElementById('restart-button');

  useEffect(() => {
    window.version(setversion)
  }, [])

  const ListDevicesA0 = async () => {
    setports([]);
    const result = await window.a0();
    setports(result);
    console.log(result);
  }

  ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = 'A new update is available. Downloading now...';
    notification.classList.remove('hidden');
  });

  ipcRenderer.on('update_downloaded', () => {
    ipcRenderer.removeAllListeners('update_downloaded');
    message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
    restartButton.classList.remove('hidden');
    notification.classList.remove('hidden');
  });

  const closeNotification = () => {
    notification.classList.add('hidden');
  }

  const restartApp = () => {
    ipcRenderer.send('restart_app');
  }



  return (
    <>
      <div>app {version}</div><p>&nbsp;</p>
      <div onClick={() => ListDevicesA0()}>List Devices</div><p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>
        {JSON.stringify(ports)}
      </p>

      <p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>

      <div id="notification" className="hidden">
        <p id="message"></p>
        <button id="close-button" onClick={() => closeNotification()}>
          Close
        </button>
        <button id="restart-button" onClick={() => restartApp()} className="hidden">
          Restart
        </button>
      </div>

    </>
  );
}

export default App;
