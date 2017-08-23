const path = require('path');
const spawn = require('child_process').spawn;
const url = require('url');
const { app, BrowserWindow, ipcMain } = require('electron');

let win;

function createWindow() {
	win = new BrowserWindow({
		height: 300,
		width: 400,
	});

	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true,
	}));

	win.setMenu(null);

	win.webContents.openDevTools();
}

app.on('ready', createWindow);

ipcMain.on('ifconfig.run', (event, arg) => {
	// const cmd = spawn('ifconfig', ['container', 'rm', ids.join(' ')]);
	let stdout = ''
	let stderr = ''

	var isWin = require('os').platform().indexOf('win') > -1
	const cmd = spawn(isWin ? 'ipconfig' : 'ifconfif')

	cmd.stdout.on('data', data => {
		stdout += data.toString()
	})

	cmd.stderr.on('data', data => {
		stderr += data.toString()
	})

	cmd.on('error', error => {
		stderr += error.message
	})

	cmd.on('close', code => {
		event.sender.send('ifconfig.done', { code, stderr, stdout })
	})
})
