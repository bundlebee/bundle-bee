// Basic init
const electron = require('electron');
const { ipcMain } = require('electron')
const { app, BrowserWindow } = electron;

// Let electron reloads by itself when webpack watches changes in ./app/
require('electron-reload')(__dirname);

// To avoid being garbage collected
let mainWindow;

app.on('ready', () => {

    mainWindow = new BrowserWindow();
    mainWindow.loadURL(`file://${__dirname}/app/index.html`)

});

ipcMain.on('ondragstart', (event, filePath) => {
    event.sender.startDrag({
        file: filePath,
        icon: '/path/to/icon.png'
    })
});