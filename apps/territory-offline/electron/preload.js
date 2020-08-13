const {ipcRenderer} = require('electron');
const path = require('path');
const electronBridge = path.join(__dirname, 'node_modules', '@capacitor', 'electron', 'dist', 'electron-bridge.js');
require(electronBridge);

process.once('loaded', () => {
  window.addEventListener('message', event => {
    const message = event.data;
    if (message.isIpcMessage === true) {
      ipcRenderer.send(message.channel, message);
    }
  });
});
