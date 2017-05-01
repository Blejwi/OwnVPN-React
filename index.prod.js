/* eslint-disable import/no-extraneous-dependencies */
const electron = require('electron');
// const electronContextMenu = require('electron-context-menu');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        return app.quit();
    }
    return null;
});

// electronContextMenu();

app.on('ready', () => {
    mainWindow = new BrowserWindow({ width: 1024, height: 728 });
    mainWindow.loadURL('http://localhost:8080/');
    mainWindow.on('closed', () => (mainWindow = null));
});
