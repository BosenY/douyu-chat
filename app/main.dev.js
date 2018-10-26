/* eslint global-require: 0, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, ipcMain } from 'electron';
import douyu from 'douyu';
import MenuBuilder from './menu';

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}
// const danmu = () => {
//   setInterval(() => {});
// };
// 异步
ipcMain.on('asynchronous-message', (event, arg) => {
  // console.log(`初始化直播间${arg || 2009}`); // prints "ping"
  const roomID = arg || 2009;
  const room = new douyu.ChatRoom(roomID);
  // System level events handler
  room.on('connect', message => {
    const huifu = `DouyuTV ChatRoom #${roomID} connected.`;
    event.sender.send('asynchronous-reply', huifu);
  });
  room.on('error', error => {
    event.sender.send('asynchronous-reply', error.toString());
    // console.error('Error: ' + error.toString());
  });
  room.on('close', hasError => {
    const ss = `DouyuTV ChatRoom #${roomID} disconnected${hasError}`
      ? ' because of error.'
      : '.';
    event.sender.send('asynchronous-reply', ss);
    // console.log(

    // );
  });

  // Chat server events
  room.on('chatmsg', message => {
    const danmu = `[${message.nn}]: ${message.txt}`;
    event.sender.send('asynchronous-reply', danmu);
  });

  // Knock, knock ...
  room.open();

  // 给客户端发请求
  // event.sender.send('asynchronous-reply', '123');
});
// 同步
ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg, 2); // prints "ping"
  event.returnValue = 'pong';
});
const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }
  // 开一个新窗口
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});
