const { app, BrowserWindow,ipcMain, screen} = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const { timestamp } = require('rxjs');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Enable Node.js integration in the Electron window,
      contextIsolation: false
    }
  });

  // Load the Angular app
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/screenshot-app/index.html`),
      protocol: 'file:',
      slashes: true
    })
  );

  ipcMain.on('capture-screenshot', () => {
    // Capture the screen
    const display = screen.getPrimaryDisplay();
    const screenshotPath = path.join(app.getPath('pictures'),`screenshot_${Date.now()}.png`);

    win.capturePage().then((image) => {
      // Save the screenshot as a PNG file
      fs.writeFile(screenshotPath, image.toPNG(), (error) => {
        if (error) {
          console.error('Failed to save screenshot:', error);
        } else {
          console.log('Screenshot saved:', screenshotPath);

          // Send a confirmation message back to the renderer process
          win.webContents.send('screenshot-captured', screenshotPath);
        }
      });
    }).catch((error) => {
      console.error('Failed to capture screenshot:', error);
    });
  });


  // Open the DevTools (optional)
  // win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});