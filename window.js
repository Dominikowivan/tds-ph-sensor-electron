const electron = require("electron");
const path = require("path");
const url = require("url");

if (process.argv[2] == "--watch") {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron"),
  });
}

// Modulo para controlar el life cycle de la aplicacion.
const app = electron.app;
// Ventana principal
const BrowserWindow = electron.BrowserWindow;

// Hay que mantener una variable global, si no, cuando se termina de correr el archivo
// el garbage collector termina eliminando la ventana
let mainWindow;

// Funcion que se llama y renderiza la ventana
function createWindow() {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });

  // Cargar el index.html de la app
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  // Abrir las DevTools.
  //mainWindow.webContents.openDevTools()

  // Se envia esto cuando se cierra la ventana
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

//Arranca electron y se crea la ventana
app.on("ready", createWindow);

// Cuando todas las ventanas estan cerradas apaga la aplicacion
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});
