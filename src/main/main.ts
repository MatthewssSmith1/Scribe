import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import * as url from 'url'
import WorkspaceManager from './workspace_manager'

let mainWindow: BrowserWindow | null

function createWindow(): void {
   // Create the browser window.
   mainWindow = new BrowserWindow({
      height: 600,
      width: 800,
      frame: false,
      webPreferences: {
         webSecurity: false,
         devTools: process.env.NODE_ENV === 'production' ? false : true,
      },
   })

   // and load the index.html of the app.
   mainWindow.loadURL(
      url.format({
         pathname: path.join(__dirname, './index.html'),
         protocol: 'file:',
         slashes: true,
      })
   )

   // Emitted when the window is closed.
   mainWindow.on('closed', () => {
      mainWindow = null
   })

   mainWindow.webContents.openDevTools()

   mainWindow.maximize()
}

app.whenReady().then(createWindow)

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

/*
 On OS X it is common for applications and their menu bar to stay active
 until the user quits explicitly with Cmd + Q and to re-create a window in
 the app when the dock icon is clicked and there are no other windows open.
 */
app.on('window-all-closed', () => {
   if (process.platform !== 'darwin') app.quit()
})
app.on('activate', () => {
   if (mainWindow === null) createWindow()
})
