const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const isDev = !app.isPackaged;
let mainWindow = null;
const argKiosk = app.commandLine.getSwitchValue("kiosk") !== '' ? parseFloat(app.commandLine.getSwitchValue("kiosk")) : 0;

// configure logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

function createWindow() {

    let offKiosk = {
        width: 1366,
        height: 768,
        title: 'ATM Machine',
        backgroundColor: "white",
        show: true,
        webPreferences: {
            nodeIntegration: true,
            worldSafeExecuteJavaScript: false,
            contextIsolation: false,
            preload: path.join(__dirname, 'preloads', 'preload.js')
        }
    }

    let onKiosk = {
        ...offKiosk,
        frame: false,
        movable: true,
        resizable: false,
        minimizable: false,
        maximizable: false,
        center: true,
        closable: false,
        focusable: true,
        alwaysOnTop: true,
        skipTaskbar: false,
        fullscreen: true,
        fullscreenable: true,
        simpleFullscreen: true,
        kiosk: true,
        acceptFirstMouse: true,
        disableAutoHideCursor: true,
        autoHideMenuBar: true,
    }

    if (isDev) {
        onKiosk = {
            ...offKiosk,
            width: 1920,
            height: 1200,
        }
    }

    const optionsWindows = argKiosk === 1 ? onKiosk : offKiosk;

    mainWindow = new BrowserWindow(optionsWindows);

    mainWindow.loadFile(`www/electron.html`, {
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36'
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.once('ready-to-show', () => {
        autoUpdater.checkForUpdatesAndNotify();
    });

}

if (isDev) {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
    });
}

ipcMain.on('notify', (_, message) => {
    new Notification({ title: 'Notification', body: message }).show();
})

ipcMain.on('app-quit', () => {
    app.quit();
})

ipcMain.on('app-restart', () => {
    mainWindow.close();
    mainWindow = null;
    createWindow();
})

ipcMain.on('app-reload', () => {
    mainWindow.loadFile(`www/electron.html`, {
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36'
    });
})

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
});

app.allowRendererProcessReuse = false;

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

//-------------------------------------------------------------------
// Auto updates
//-------------------------------------------------------------------
autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});