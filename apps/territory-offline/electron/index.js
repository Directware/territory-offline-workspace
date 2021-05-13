const {app, BrowserWindow, shell} = require('electron');
const {CapacitorSplashScreen, configCapacitor} = require('@capacitor/electron');
const {ipcMain, dialog} = require('electron');
const fs = require('fs');
const path = require('path');

/* App configs */
app.allowRendererProcessReuse = true;
const APP_DIR_PATH = `${app.getPath('home')}/territory-offline`;

// Place holders for our windows so they don't get garbage collected.
let mainWindow = null;

// Placeholder for SplashScreen ref
let splashScreen = null;

//Change this if you do not wish to have a splash screen
let useSplashScreen = true;

async function createWindow() {
  // Define our main window size
  mainWindow = new BrowserWindow({
    height: 920,
    width: 1600,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      devTools: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      experimentalFeatures: false
    }
  });

  configCapacitor(mainWindow);

  if (useSplashScreen) {
    splashScreen = new CapacitorSplashScreen(mainWindow, {imageFileName: "splash.jpeg"});
    splashScreen.init(false);
  } else {
    mainWindow.loadURL(`file://${__dirname}/app/index.html`);
    mainWindow.webContents.on('dom-ready', () => {
      mainWindow.show();
    });
  }

  if (!fs.existsSync(path)) {
    fs.mkdir(APP_DIR_PATH, () => {
    });
  }

  ipcMainListeners();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some Electron APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }

  mainWindow = null;
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// Define any IPC or other custom functionality below here
function ipcMainListeners() {
  console.log("init ipc main listeners");
  ipcMain.on('getSystemInfo', (e) => mainWindow.webContents.send('systemInfo', {
    baseDir: __dirname
  }));

  ipcMain.on('print', (e) => {
    mainWindow.webContents.print();
  });

  ipcMain.on('save-file', (e, msg) => {
    const path = msg.data.subPath ? `${APP_DIR_PATH}/${msg.data.subPath}` : APP_DIR_PATH;
    const filePath = `${path}/${msg.data.fileName}`;

    const createFile = () => {
      fs.writeFile(filePath, Buffer.from(msg.data.file, 'base64'), (error) => {
        if (error) {
          dialog.showErrorBox("Error", `${msg.data.fileName} could not be saved!`)
        } else {
          shell.showItemInFolder(filePath);
        }
      });
    }

    if (!fs.existsSync(path)) {
      fs.mkdir(path, (error) => {
        if (error) {
          dialog.showErrorBox("Error", `${msg.data.fileName} could not be saved!`)
        } else {
          createFile();
        }
      });
      return;
    }

    createFile();
  });

  ipcMain.on('downloadNewAppVersion', (e, msg) => {
    shell.openExternal(msg.data.currentOsDownloadUrl).catch(() => alert(`Fehler beim Herunterladen von Version ${info.version}`));
  });

  ipcMain.on('restartTerritoryOffline', (e, info) => {
    app.relaunch({args: process.argv.slice(1).concat(['--relaunch'])})
    app.exit(0)
  });
}
