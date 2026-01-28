import { app, BrowserWindow } from 'electron'
import path from 'path'

/**
 * Set `__statics` path to static files in production.
 * Path needs to be evaluated at runtime.
 */
if (process.env.PROD) {
  global.__statics = path.join(__dirname, 'statics').replace(/\\/g, '\\\\')
}

let mainWindow

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      // Enable Node.js integration if needed
      nodeIntegration: true,
      contextIsolation: false,
      // Preload script if required
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // Load the app URL (production or development)
  mainWindow.loadURL(process.env.APP_URL)

  // Open DevTools automatically in development
  if (!process.env.PROD) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Electron app ready
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Recreate window on macOS when dock icon is clicked
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
