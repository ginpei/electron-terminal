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

ipcMain.on('command.run', (event, arg) => {
	// const cmd = spawn('ifconfig', ['container', 'rm', ids.join(' ')]);
	let error = null
	let output = ''
	let stdout = ''
	let stderr = ''

	const [entry, ...commandArgs] = arg.command.split(' ')
	console.log(entry, commandArgs);
	const cmd = spawn(entry, commandArgs)

	cmd.stdout.on('data', data => {
		const text = data.toString()
		console.log('stdout', text)
		output += text
		stdout += text
	})

	cmd.stderr.on('data', data => {
		const text = data.toString()
		console.log('stderr', text)
		output += text
		stderr += text
	})

	cmd.on('error', _error => {
		console.log('ERROR', _error.message)
		error = _error
	})

	cmd.on('close', code => {
		console.log('done!')
		event.sender.send('command.done', { code, error, output, stderr, stdout })
	})
})
