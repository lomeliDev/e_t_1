import React, { useState, useEffect } from "react";
const { ipcRenderer } = require('electron');


function App() {
  const [ports, setports] = useState([]);
  const [version, setversion] = useState("");
  const [message, setmessage] = useState("");
  const [notification, setnotification] = useState("hidden");
  const [restartButton, setrestartButton] = useState("hidden");


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
    setnotification('');
    setmessage('A new update is available. Downloading now...');
  });

  ipcRenderer.on('update_downloaded', () => {
    ipcRenderer.removeAllListeners('update_downloaded');
    setnotification('');
    setrestartButton('');
    setmessage('Update Downloaded. It will be installed on restart. Restart now?');
  });

  const closeNotification = () => {
    setnotification('hidden');
  }

  const restartApp = () => {
    ipcRenderer.send('restart_app');
  }



  return (
    <>
      <div>app {version}</div><p>&nbsp;</p>
      <div onClick={() => ListDevicesA0()}>List Devices 2</div><p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>
        {JSON.stringify(ports)}
      </p>
      <p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>
      <div id="notification" className={`${notification}`}>
        <p id="message">{message}</p>
        <button id="close-button" onClick={() => closeNotification()}>
          Close
        </button>
        <button id="restart-button" onClick={() => restartApp()} className={`${restartButton}`}>
          Restart
        </button>
      </div>

    </>
  );
}

export default App;
