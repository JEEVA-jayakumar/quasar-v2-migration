/**
 * Development-only Electron setup:
 * Installs `electron-debug` & Vue 3 DevTools.
 */

const { app } = require('electron')

// Install `electron-debug` with DevTools open
require('electron-debug')({ showDevTools: true })

// Install Vue 3 DevTools
app.on('ready', async () => {
  try {
    const installExtension = require('electron-devtools-installer')
    await installExtension.default(installExtension.VUEJS3_DEVTOOLS)
    console.log('Vue 3 DevTools installed successfully')
  } catch (err) {
    console.error('Unable to install Vue 3 DevTools:\n', err)
  }
})

// Start the main Electron process
require('./electron-main')
