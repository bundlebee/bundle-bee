// Basic init

//New Concise Import Statements
const { app, BrowserWindow, ipcMain, ipcRender, Menu, Dialog } = require('electron');
const bundlerProcesses = require('./backend/create-config/create-webpack-config.js');
const createMenuBar = require('./backend/menuBar.js');

// Old Code
// const electron = require('electron');
// const { ipcMain, ipcRenderer } = require('electron');
// const { app, BrowserWindow } = electron;
// const bundlerProcesses = require('./backend/create-config/create-webpack-config.js');
// Let electron reloads by itself when webpack watches changes in ./app/
require('electron-reload')(__dirname);

// To avoid being garbage collected
let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({width: 1024, height: 765});
  mainWindow.loadURL(`file://${__dirname}/app/index.html`);

  //Adding Menu Bar
  const menu = Menu.buildFromTemplate(createMenuBar(mainWindow));
  Menu.setApplicationMenu(menu);
});

ipcMain.on('ondragstart', (event, filePath) => {
  event.sender.startDrag({
    file: filePath,
    icon: '/path/to/icon.png',
  });

  console.log('asdf drag');
  event.sender.send('asdf', null);
});

let parsedFilesInfo;
ipcMain.on('check-root-directory', (event, rootDirPath) => {
  bundlerProcesses
    .indexFilesFromRoot(rootDirPath)
    .then(res => {
      // set globally so other emitters in main can access it without always passing the object back and forth
      parsedFilesInfo = res;
      if (!parsedFilesInfo.entryFileAbsolutePath) {
        console.log('no entry file found');
      }
      event.sender.send('webpack-config-check', res);
    })
    .catch(e => console.log(e));
});

ipcMain.on('run-webpack', (event, { createNewConfig }) => {
  parsedFilesInfo.createNewConfig = createNewConfig;
  bundlerProcesses
    .runWebpack(parsedFilesInfo)
    .then(res => {
      parsedFilesInfo = {};
      console.log('finished running webpack');

      event.sender.send('webpack-stats-results-json', res); // send a message to the front end that the webpack compilation stats json is ready
    })
    .catch(e => console.log('error:', e));
});
