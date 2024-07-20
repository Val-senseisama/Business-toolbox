import {app, BrowserWindow} from "electron"
import path from "path"
import fs from "fs"

function createWindow () {
  const win = new BrowserWindow({
    width: 1300,
    height: 800,
    minWidth: 1024,
    minHeight: 760,
    fullscreenable: false,
    resizable: true,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        enableRemoteModule: true,
        devTools: true,
      }
  })

  win.loadFile('index.html')
};


app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})