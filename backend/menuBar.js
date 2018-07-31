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
          label: 'Webpack',
          submenu: [
            { checked: true, label: 'Tree Shaking', type: 'checkbox' },
            { checked: true, label: 'Code Splitting', type: 'checkbox' },
            { checked: true, label: 'Source Maps', type: 'checkbox' },
            { checked: true, label: 'Minify', type: 'checkbox' },
            { checked: true, label: 'Uglify', type: 'checkbox' },
            { type: 'separator' },
          ],
          accelerator: 'CmdOrCtrl+W',
          click() {
            console.log(submenu)
            buildWebpack();
          }
        },
        {
          label: 'Parcel',
          accelerator: 'CmdOrCtrl+P',
          click() {
            buildParcel();
          }
        },
        {
          label: 'Rollup',
          accelerator: 'CmdOrCtrl+R',
          click() {
            buildRollup();
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
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' }
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

    // Edit menu
    menuBar[2].submenu.push(
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }]
      }
    );

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
