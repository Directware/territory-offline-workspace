const { ipcRenderer } = require("electron");

process.once("loaded", () => {
  console.log("[PRELOAD] process 'loaded' event");

  window.addEventListener("message", (event) => {
    console.log("[PRELOAD] process 'message' event");

    const message = event.data;
    if (message.isIpcMessage === true) {
      ipcRenderer.send(message.channel, message);
    }
  });
});
