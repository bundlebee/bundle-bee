module.exports = function createMenuBar(mainWindow, ResetDir) {

  // Need to import OpenDir, ResetDir, OpenWebpackConfig, OpenParcelConfig, OpenRollupConfig functions from main_process.js



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
          }
        },
        {
          label: 'Save File',
          accelerator: 'CmdOrCtrl+S',
          click() {
            mainWindow.webContents.send('save-file');
          }
        }
      ]
    },
    {
      label: 'Build',
      submenu: [
        {
          label: 'Show Webpack Config',
          accelerator: 'CmdOrCtrl+W',
          click() {
            OpenConfig('webpack');
          }
        },
        {
          label: 'Parcel',
          accelerator: 'CmdOrCtrl+P',
          click() {
            OpenConfig('parcel');
          }
        },
        {
          label: 'Rollup',
          accelerator: 'CmdOrCtrl+R',
          click() {
            OpenRollupConfig();
          }
        }
      ]
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
        { role: 'selectall' }
      ]
    },
    {
      role: 'window',
      submenu: [{ role: 'minimize' }, { role: 'close' }]
    },
    {
      label: 'Developer',
      submenu: [
        {
          label: 'Toggle Developer Tools',
          accelerator:
            process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click() {
            mainWindow.webContents.toggleDevTools();
          }
        }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            require('electron').shell.openExternal('https://github.com/bundlebee/bundle-bee');
          }
        }
      ]
    }
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
        { role: 'quit' }
      ]
    });
    // Window menu
    menuBar[4].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ];
  }
  return menuBar;
}