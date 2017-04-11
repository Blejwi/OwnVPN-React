const electron = require('electron');
const developerTools = require('electron-devtools-installer');
const app = electron.app;
require('electron-debug')({showDevTools: true});
const BrowserWindow = electron.BrowserWindow;
let mainWindow = null;

app.on('window-all-closed', () => (process.platform !== 'darwin')?app.quit():null);

app.on('ready', () => {
    developerTools.default(developerTools.REACT_DEVELOPER_TOOLS);
    developerTools.default(developerTools.REDUX_DEVTOOLS);
    mainWindow = new BrowserWindow({width: 1024, height: 728});
    mainWindow.loadURL('http://localhost:8080/');
    mainWindow.on('closed', () => mainWindow = null);
});
