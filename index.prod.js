/* eslint-disable import/no-extraneous-dependencies */
const { app, BrowserWindow } = require('electron');

let mainWindow = null;

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        return app.quit();
    }
    return null;
});

app.on('ready', () => {
    mainWindow = new BrowserWindow({ width: 1024, height: 728 });
    mainWindow.loadURL('http://localhost:8080/');
    mainWindow.on('closed', () => (mainWindow = null));
});
