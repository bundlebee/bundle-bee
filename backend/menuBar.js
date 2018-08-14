module.exports = function createMenuBar(mainWindow, ResetDir, OpenDir, OpenConfig) {

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
          enabled: false,
          label: 'Show Webpack Config',
          accelerator: 'CmdOrCtrl+W',
          click() {
            OpenConfig('webpack');
          }
        },
        {
          enabled: false,
          label: 'Show Parcel Config',
          accelerator: 'CmdOrCtrl+P',
          click() {
            OpenConfig('parcel');
          }
        },
        {
          enabled: false,
          label: 'Show Rollup Config',
          accelerator: 'CmdOrCtrl+R',
          click() {
            OpenConfig('rollup');
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