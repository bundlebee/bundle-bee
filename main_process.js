// Basic init

const { app, BrowserWindow, ipcMain, Menu, Dialog } = require('electron');
const createMenuBar = require('./backend/menuBar.js');
const { fork } = require('child_process');
const path = require('path');
const fs = require('fs');
require('electron-reload')(__dirname, { ignored: /electronUserData|node_modules|[\/\\]\./ });

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
  const indexFilesChild = fork(pathToIndexFileModule, [rootDirPath]);
  indexFilesChild.on('message', ({ foundWebpackConfig, foundEntryFile, e }) => {
    if (e) console.log('Error: ', e);
    event.sender.send('handle-file-indexing-results', {
      foundWebpackConfig,
      foundEntryFile,
    });
  });
});

ipcMain.on('run-webpack', (event, { createNewConfig, pathFromDrag }) => {
  const pathToCreateWebpackFileModule = path.join(
    __dirname,
    'backend',
    'create-config',
    'utils',
    'createWebpackConfig.js'
  );
  const pathToRunWebpackFileModule = path.join(
    __dirname,
    'backend',
    'create-config',
    'utils',
    'runWebpack.js'
  );
  const pathToWriteStatsFile = path.join(__dirname, 'electronUserData', 'stats.json');

  if (createNewConfig) {
    const createWebpackChild = fork(pathToCreateWebpackFileModule, [pathFromDrag]);
    createWebpackChild.on('message', ({ webpackDirectory, err }) => {
      if (err) console.log('Error: ', err);
      const runWebpackChild = fork(pathToRunWebpackFileModule, [pathToWriteStatsFile], {
        cwd: webpackDirectory,
      });
      runWebpackChild.on('message', message => {
        if (message.error) {
          console.log('error: ', message.error);
        } else {
          console.log('webpack successfully run and stats.json successfully written...');
          event.sender.send('webpack-stats-results-json');
        }
      });
    });
  } else {
    const { rootDir } = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'electronUserData', 'configurationData.js'), 'utf-8')
    );
    const runWebpackChild = fork(pathToRunWebpackFileModule, [pathToWriteStatsFile], {
      cwd: rootDir,
    });
    runWebpackChild.on('message', message => {
      if (message.error) {
        console.log('error: ', message.error);
      } else {
        console.log('webpack successfully run and stats.json successfully written...');
        event.sender.send('webpack-stats-results-json');
      }
    });
  }
});

ipcMain.on('run-parcel', event => {
  const pathToRunParcelFileModule = path.join(
    __dirname,
    'backend',
    'create-config',
    'utils',
    'runParcel.js'
  );
  
  const { rootDir } = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'electronUserData', 'configurationData.js'), 'utf-8')
  );
  
  const pathToWriteStatsFile = path.join(__dirname, 'electronUserData', 'parcel-stats.json');
  const createParcelChild = fork(pathToRunParcelFileModule, [rootDir, pathToWriteStatsFile]);
  createParcelChild.on('message', message => {
    if (message.error) {
      console.log('error: ', message.error);
    } else {
      console.log('parcel successfully run and stats.json successfully written...');
      event.sender.send('parcel-stats-results-json');
    }
  });
});

ipcMain.on('run-rollup', event => {
  const pathToRunRollupModule = path.join(
    __dirname,
    'backend',
    'create-config',
    'utils',
    'runRollup.js'
  );
  const pathToWriteStatsFile = path.join(__dirname, 'electronUserData', 'rollup-stats.json');
  const createRollupChild = fork(pathToRunRollupModule, [pathToWriteStatsFile]);
});
