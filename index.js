/* eslint-disable import/no-extraneous-dependencies */
const { app, BrowserWindow } = require('electron');
const developerTools = require('electron-devtools-installer');
const electronDebug = require('electron-debug');
const electronContextMenu = require('electron-context-menu');

let mainWindow = null;

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        return app.quit();
    }
    return null;
});

electronDebug({ showDevTools: true });
electronContextMenu();

app.on('ready', () => {
    developerTools.default(developerTools.REACT_DEVELOPER_TOOLS);
    developerTools.default(developerTools.REDUX_DEVTOOLS);
    mainWindow = new BrowserWindow({ width: 1024, height: 728 });
    mainWindow.loadURL('http://localhost:8080/');
    mainWindow.on('closed', () => (mainWindow = null));
});
