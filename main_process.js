// Basic init
const { app, BrowserWindow, ipcMain, ipcRender, Menu, Dialog } = require('electron');
const bundlerProcesses = require('./backend/create-config/create-webpack-config.js');
const createMenuBar = require('./backend/menuBar.js');

// Let electron reloads by itself when webpack watches changes in ./app/
require('electron-reload')(__dirname);

// To avoid being garbage collected
let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({width: 800, height: 800});
  mainWindow.loadURL(`file://${__dirname}/app/index.html`);

  const menu = Menu.buildFromTemplate(createMenuBar(mainWindow));
  Menu.setApplicationMenu(menu);

});

ipcMain.on('ondragstart', (event, filePath) => {
  event.sender.startDrag({
    file: filePath,
    icon: '/path/to/icon.png',
  });
});

let parsedFilesInfo;
ipcMain.on('check-root-directory', (event, rootDirPath) => {
  bundlerProcesses
    .indexFilesFromRoot(rootDirPath)
    .then(res => {
      // set globally so other emitters in main can access it without always passing the object back and forth
      parsedFilesInfo = res;
      event.sender.send('webpack-config-check', res);
    })
    .catch(e => console.log(e));
});

ipcMain.on('run-webpack', (event, { createNewConfig }) => {
  parsedFilesInfo.createNewConfig = createNewConfig;
  bundlerProcesses
    .runWebpack(parsedFilesInfo)
    .then(() => {
      parsedFilesInfo = null;
      console.log('finished creating webpack config');
    })
    .catch(e => console.log('error:', e));
});
