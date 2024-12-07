const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Function to create the browser window
function createWindow() {
  // Create the browser window
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the React app index.html after build
  win.loadURL('http://localhost:4500');  // Development mode URL
  // OR after you build your React app, point to the dist directory (production mode):
  // win.loadFile(path.join(__dirname, '..','build', 'index.html'));

  // Open DevTools if in development mode
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }
}

// Electron app lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
