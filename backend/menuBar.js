const shell = require('electron').shell;
const path = require('path');
const upath = require('path');
const fs = require('fs');

const dists = ['webpack-dist', 'parcel-dist', 'rollup-dist'];
let webpackDist, parcelDist, rollupDist;
[webpackDist, parcelDist, rollupDist] = dists.map(dist =>
  upath.normalize(path.join(__dirname, '..', 'electronUserData', dist, 'package.json'))
);

function getStatus(dist) {
  const isEnabled = fs.existsSync(dist);
  console.log('getStatus ran: ', isEnabled);
  return isEnabled;
}

module.exports = function createMenuBar(mainWindow, ResetDir, OpenDir) {

  const menuBar = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open Root Directory',
          accelerator: 'CmdOrCtrl+O',
          click() {
            OpenDir();
          }
        },
        {
          label: 'Reset Directory',
          accelerator: 'CmdOrCtrl+D',
          click() {
            ResetDir();
          },
        }
      ],
    },
    {
      label: 'View Config',
      submenu: [
        {
          label: 'Show Webpack Config',
          accelerator: 'CmdOrCtrl+W',
          click() {
            console.log('clicked: webpack');
            shell.showItemInFolder(webpackDist);
          },
        },
        {
          label: 'Show Parcel Config',
          accelerator: 'CmdOrCtrl+P',
          click() {
            shell.showItemInFolder(parcelDist);
          },
        },
        {
          label: 'Show Rollup Config',
          accelerator: 'CmdOrCtrl+R',
          click() {
            shell.showItemInFolder(rollupDist);
          },
        },
      ],
    },

    {
      role: 'window',
      submenu: [{ role: 'minimize' }, { role: 'close' }],
    },
    {
      label: 'Developer',
      submenu: [
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click() {
            mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            require('electron').shell.openExternal('https://github.com/bundlebee/bundle-bee');
          },
        },
      ],
    },
  ];

  return menuBar;
};
