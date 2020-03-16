'use strict';

const { Tray, app, BrowserWindow, globalShortcut, dialog, Menu, ipcMain } = require('electron');
const DiscordRPC = require('./rpc');

let mainWindow = null;
let contextMenu = null;

function createWindow() {
	mainWindow = new BrowserWindow({
		title: "Just Dance 2020",
		width: 1410,
		height: 793,
		resizable: true,
		backgroundColor: '#222222',
		frame: true,
		fullScreen: true,
		titleBarStyle: 'hidden',
		transparent: false,
		webPreferences: {
		  devTools: true,
		  preload: __dirname + '/renderer.js'
		}
	});
	console.log("Render started");
	mainWindow.loadURL("https://justdancenow.com/");
	mainWindow.setMenu(null);
	mainWindow.on('closed', () => {
		mainWindow = null;
		app.quit();
	});
	mainWindow.on('maximize', function(event){
		event.preventDefault();
		mainWindow.setFullScreen(true);
	});
	mainWindow.on('close', function (event) {
		console.log("Windows closed");
		app.quit();
	});
	mainWindow.webContents.openDevTools();
}

app.on('ready', createWindow);
let debounce = Date.now();
let keyHandler = function() {
  if (Date.now() - debounce < 500) return;
  debounce = Date.now();
  mainWindow.setFullScreen((!mainWindow.isFullScreen()));
  if (!mainWindow.isFullScreen()) {
  	mainWindow.unMaximize();
  }
}
app.on('ready', () => {
  globalShortcut.register('Esc', keyHandler);
  globalShortcut.register('F11', keyHandler);
  globalShortcut.register('Alt+Enter', keyHandler);
  mainWindow.setTitle("Just Dance 2020");
});

app.on('window-all-closed', () => {
  app.quit();
});

let first_ = false;
app.on('browser-window-created', (ev, win) => {
	if (first_) {
		win.close();
	} else {
		first_ = true;
		return;
	}
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

let fields = {
	details: "Menu",
	largeImageKey: "jd",
	largeImageText: "Just Dance 2020"
};

ipcMain.handle('rpc', (event, args) => {
  console.log("[Selenium] IPCUpdateRequested: " + args);
  setActivity(args);
  rpc.setActivity(args);
});

ipcMain.handle('log', (event, args) => {
  return console.log("[Renderer] " + args);
});

const clientId = '675875601529176085';

DiscordRPC.register(clientId);

const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const startTimestamp = new Date();

async function setActivity(_fields = fields) {
  console.log("[RPC] Presence updating");
  if (!rpc || !mainWindow) {
    return;
  }
  rpc.setActivity(_fields);
  console.log("[RPC] TransportUpdate:", JSON.stringify(_fields));
}

rpc.on('ready', () => {
  setActivity();
  /*setInterval(() => {
    setActivity();
  }, 15e3);*/
});

rpc.login({ clientId }).catch(console.error);