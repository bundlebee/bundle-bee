// Basic init

const { app, BrowserWindow, ipcMain, ipcRender, Menu, Dialog } = require('electron');
const createMenuBar = require('./backend/menuBar.js');
const { fork } = require('child_process');
const path = require('path');
const {
  // indexFilesFromRoot,
  runWebpack,
} = require('./backend/create-config/process-and-bundle-project.js');
const fs = require('fs');
require('electron-reload')(__dirname);

// To avoid being garbage collected
let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 200, height: 765 });
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
});

ipcMain.on('index-project-files-from-dropped-item-path', (event, rootDirPath) => {
  const pathToIndexFileModule = path.join(
    __dirname,
    'backend',
    'create-config',
    'utils',
    'indexFilesFromRoot.js'
  );
  const child = fork(pathToIndexFileModule, [rootDirPath]);
  child.on('message', ({ foundWebpackConfig, foundEntryFile }) => {
    event.sender.send('handle-file-indexing-results', {
      foundWebpackConfig,
      foundEntryFile,
    });
  });
});

ipcMain.on('run-webpack', (event, { createNewConfig }) => {
  const pathToUserFileInfo = path.join(__dirname, '..', 'electronUserData', 'configurationData.js');
  const parsedFilesInfo = JSON.parse(fs.readFileSync(pathToUserFileInfo, 'utf-8'));
  parsedFilesInfo.createNewConfig = createNewConfig;
  runWebpack(parsedFilesInfo)
    .then(res => {
      console.log('finished running webpack');
      event.sender.send('webpack-stats-results-json', res); // send a message to the front end that the webpack compilation stats json is ready
    })
    .catch(e => console.log('error:', e));
});
