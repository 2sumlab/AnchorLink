const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const express = require('express');

const server = express();
const port = 3000;

let engine = require("ejs-locals");

// Process Get Request
server.get('/open-file', (req, res) => {
    const filePath = req.query.path;
    if (filePath) {
        // Open File
        shell.openPath(filePath).then(() => {
            res.render("open_success", { open_file_path: filePath });
        }).catch(err => {
            console.log(`Open File Failed ${err.message}`)
            res.render("open_fail", { open_file_path: filePath });
        });
    } else {
        res.render("no_path");
    }
});

// Open or Create File/Folder - creates the path if it doesn't exist
// type=folder creates a directory; default creates a file
server.get('/open-or-create', (req, res) => {
    const filePath = req.query.path;
    const isFolder = req.query.type === 'folder';

    if (!filePath) {
        res.render("no_path");
        return;
    }

    const exists = fs.existsSync(filePath);
    if (!exists) {
        try {
            if (isFolder) {
                fs.mkdirSync(filePath, { recursive: true });
            } else {
                fs.mkdirSync(path.dirname(filePath), { recursive: true });
                fs.writeFileSync(filePath, '');
            }
        } catch (err) {
            console.log(`Create Failed ${err.message}`);
            res.render("open_fail", { open_file_path: filePath });
            return;
        }
    }

    shell.openPath(filePath).then(() => {
        if (exists) {
            res.render("open_success", { open_file_path: filePath });
        } else {
            res.render("create_success", { open_file_path: filePath, item_type: isFolder ? 'Folder' : 'File' });
        }
    }).catch(err => {
        console.log(`Open Failed ${err.message}`);
        res.render("open_fail", { open_file_path: filePath });
    });
});

// Booming Express Service
server.listen(port, () => {
    console.log(`Express Server is Runing http://localhost:${port}`);
});

server.engine("ejs", engine);
server.set("views", __dirname + "/views");
server.set("view engine", "ejs");
server.use(express.static(__dirname + '/views'));

function createWindow () {
    const win = new BrowserWindow({
        width: 500,
        height: 550,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: true
        },
        backgroundColor: "#f3f3f2",
        resizable: false,
        icon: path.join(__dirname, '/icon/AnchorLink.ico')
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Listening Open File Event
ipcMain.on('open-file', (event, filePath) => {
    shell.openPath(filePath);
});