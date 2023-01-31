const { app, BrowserWindow, shell } = require("electron");
const {
  CapacitorSplashScreen,
  configCapacitor,
} = require("@capacitor/electron");
const { ipcMain, dialog } = require("electron");
const fs = require("fs");
const path = require("path");
const { Base64 } = require("js-base64");

console.log("############################");
console.log("Start Territory Offline.");
console.log("############################");

/* App configs */
app.allowRendererProcessReuse = true;
const APP_DIR_PATH = `${app.getPath("home")}/territory-offline`;
console.log("[INDEX] app dir path: " + APP_DIR_PATH);

// Place holders for our windows so they don't get garbage collected.
let mainWindow = null;

// Placeholder for SplashScreen ref
let splashScreen = null;

//Change this if you do not wish to have a splash screen
let useSplashScreen = false;

async function createWindow() {
  const preload = path.join(__dirname, "preload.js");
  console.log("[INDEX] create window");
  console.log("[INDEX] preload: " + preload);

  // Define our main window size
  mainWindow = new BrowserWindow({
    height: 920,
    width: 1600,
    show: false,
    webPreferences: {
      preload: preload,
      nodeIntegration: true,
      devTools: true,
      contextIsolation: false,
      experimentalFeatures: false,
    },
  });

  mainWindow.webContents.on("dom-ready", () => {
    console.log("[INDEX] 'dom-ready' event");
    ipcMainListeners();
  });

  configCapacitor(mainWindow);

  if (useSplashScreen) {
    console.log("[INDEX] using splsh screen.");
    splashScreen = new CapacitorSplashScreen(mainWindow, {
      imageFileName: "splash.jpeg",
    });
    splashScreen.init(false);
  } else {
    console.log("[INDEX] skip splash screen.");
    mainWindow.loadURL(`file://${__dirname}/app/index.html`);
    mainWindow.webContents.on("dom-ready", () => {
      mainWindow.show();
    });
  }

  if (!fs.existsSync(path)) {
    fs.mkdir(APP_DIR_PATH, () => {});
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some Electron APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }

  mainWindow = null;
});

app.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// Define any IPC or other custom functionality below here
function ipcMainListeners() {
  console.log("[INDEX] init ipc main listeners");

  ipcMain.on("getSystemInfo", (e) =>
    mainWindow.webContents.send("systemInfo", {
      baseDir: __dirname,
    })
  );

  ipcMain.on("print", (e) => {
    console.log("[INDEX] ipc main 'print' event");
    mainWindow.webContents.print();
  });

  ipcMain.on("ping", (e) => {
    console.log("[INDEX] ipc main 'ping' event");
  });

  ipcMain.on("save-file", (e, msg) => {
    console.log("[INDEX] ipc main 'save-file' event");

    const path = msg.data.subPath
      ? `${APP_DIR_PATH}/${msg.data.subPath}`
      : APP_DIR_PATH;
    const filePath = `${path}/${msg.data.fileName}`;

    const createFile = () => {
      let data;

      if (Base64.isValid(msg.data.file)) {
        data = Buffer.from(msg.data.file, "base64");
      } else {
        data = Buffer.from(Base64.btoa(msg.data.file), "base64");
      }

      fs.writeFile(filePath, data, (error) => {
        if (error) {
          dialog.showErrorBox(
            "Error",
            `${msg.data.fileName} could not be saved!`
          );
        } else {
          shell.showItemInFolder(filePath);
        }
      });
    };

    if (!fs.existsSync(path)) {
      fs.mkdir(path, (error) => {
        if (error) {
          dialog.showErrorBox(
            "Error",
            `${msg.data.fileName} could not be saved!`
          );
        } else {
          createFile();
        }
      });
      return;
    }

    createFile();
  });

  ipcMain.on("downloadNewAppVersion", (e, msg) => {
    shell
      .openExternal(msg.data.currentOsDownloadUrl)
      .catch(() =>
        alert(`Fehler beim Herunterladen von Version ${info.version}`)
      );
  });

  ipcMain.on("restartTerritoryOffline", (e, info) => {
    app.relaunch({ args: process.argv.slice(1).concat(["--relaunch"]) });
    app.exit(0);
  });
}
