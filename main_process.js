// @ts-nocheck
// Basic init
const { app, BrowserWindow, ipcMain, Menu, Dialog, shell } = require('electron');
const createMenuBar = require('./backend/menuBar.js');
const { fork, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// To avoid being garbage collected
let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 1300, height: 900 });
  mainWindow.loadURL(`file://${__dirname}/app/index.html`);
  //Adding Menu Bar
  const menu = Menu.buildFromTemplate(createMenuBar(mainWindow, ResetDir, OpenDir));
  Menu.setApplicationMenu(menu);
  // const initialStartFlagFilePath = path.join(__dirname, 'electronUserData', 'initialStartup.txt');
  // if (!fs.existsSync(initialStartFlagFilePath)) {
  //   let pathToExecutable;
  //   if (process.platform === 'darwin') {
  //     pathToExecutable = path.join(__dirname, '..', '..', 'MacOS', 'bundle-bee');
  //   } else if (process.platform === 'win32') {
  //     pathToExecutable = path.join(__dirname, '..', '..', 'MacOS', 'bundle-bee');
  //   }
  //   fs.writeFile(
  //     initialStartFlagFilePath,
  //     `command to run executable:
  //   open ${pathToExecutable}
  //   dirname: ${__dirname}
  //   filename: ${__filename}
  //   initalstartflagfilepath: ${initialStartFlagFilePath}
  //   `
  //   );
  //   exec(`open ${pathToExecutable}`, err => {
  //     app.exit(0);
  //   });
  // } else {
  //   fs.unlink(initialStartFlagFilePath, err => {
  //     if (err) console.log(err);
  //   });
  // }
  // mainWindow.on('close', () => {
  //   app.exit(0);
  // });
});

ipcMain.on('ondragstart', (event, filePath) => {
  event.sender.startDrag({
    file: filePath,
    icon: '/path/to/icon.png',
  });
});
ipcMain.on('restart', () => {
  ResetDir();
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
    if (e) {
      console.log(e);
      return event.sender.send('error');
    }
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
      if (err) return event.sender.send('error');
      const runWebpackChild = fork(pathToRunWebpackFileModule, [pathToWriteStatsFile], {
        cwd: webpackDirectory,
      });
      runWebpackChild.on('message', message => {
        if (message.error) {
          console.log(message.error);
          return event.sender.send('error');
        }
        console.log('webpack successfully run and stats.json successfully written...');
        event.sender.send('webpack-stats-results-json', __dirname);
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
        console.log(message.error);
        return event.sender.send('error');
      }
      console.log('webpack successfully run and stats.json successfully written...');
      event.sender.send('webpack-stats-results-json', __dirname);
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
      console.log(message.error);
      return event.sender.send('error');
    }
    console.log('parcel successfully run and stats.json successfully written...');
    event.sender.send('parcel-stats-results-json', __dirname);
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
  createRollupChild.on('message', message => {
    if (message.error) {
      console.log(message.error);
      return event.sender.send('error');
    }
    console.log('rollup successfully run and stats.json successfully written...');
    event.sender.send('rollup-stats-results-json', __dirname);
  });
});

function ResetDir() {
  app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) });
  console.log('running reset dir2');
  app.exit(0);
};

function OpenDir(build) {

}