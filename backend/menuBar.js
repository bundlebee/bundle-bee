const shell = require('electron').shell;
const path = require('path');
const upath = require('path');

const dists = ['webpack-dist', 'parcel-dist', 'rollup-dist'];
let webpackDist, parcelDist, rollupDist;
[webpackDist, parcelDist, rollupDist] = dists.map(dist =>
  upath.normalize(path.join(__dirname, '..', 'electronUserData', dist, 'package.json'))
);

module.exports = function createMenuBar(mainWindow) {
  const menuBar = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open Root Directory',
          accelerator: 'CmdOrCtrl+O',
          click() {
            openDir();
          },
        },
        {
          label: 'Reset Directory',
          accelerator: 'CmdOrCtrl+D',
          click() {
            ResetDir();
          },
        },
        {
          label: 'Save File',
          accelerator: 'CmdOrCtrl+S',
          click() {
            mainWindow.webContents.send('save-file');
          },
        },
      ],
    },
    {
      label: 'View Config',
      submenu: [
        {
          label: 'Webpack',
          accelerator: 'CmdOrCtrl+W',
          click() {
            console.log('clicked: webpack');
            shell.showItemInFolder(webpackDist);
          },
        },
        {
          label: 'Parcel',
          accelerator: 'CmdOrCtrl+P',
          click() {
            shell.showItemInFolder(parcelDist);
          },
        },
        {
          label: 'Rollup',
          accelerator: 'CmdOrCtrl+R',
          click() {
            shell.showItemInFolder(rollupDist);
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' },
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

  // If macOS
  if (process.platform === 'darwin') {
    menuBar.unshift({
      label: 'Bundle Bee',
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    });
    // Window menu
    menuBar[4].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' },
    ];
  }
  return menuBar;
};
