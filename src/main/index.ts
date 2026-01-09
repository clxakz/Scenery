import { app, BrowserWindow } from "electron";
import { join } from "path";
import { electronApp, is } from "@electron-toolkit/utils";
import { useApi } from "./api";
import { autoUpdater } from "electron-updater";

autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

let mainWindow: BrowserWindow | null = null;
const gotLock = app.requestSingleInstanceLock();

function createWindow(): void {
	mainWindow = new BrowserWindow({
		width: 1100,
		height: 730,
		minWidth: 600,
		minHeight: 400,
		alwaysOnTop: is.dev,
		show: false,
		titleBarStyle: "hidden",
		titleBarOverlay: {
			color: "rgba(0,0,0,0)",
			height: 25,
			symbolColor: "#5e5e5e",
		},

		webPreferences: {
			preload: join(__dirname, "../preload/index.js"),
		},
	});

	mainWindow.on("ready-to-show", () => {
		mainWindow?.webContents.on("dom-ready", () => {
			mainWindow!.show();
		});
	});

	mainWindow.setMenu(null);

	if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
		mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
		mainWindow.webContents.openDevTools({ mode: "detach" });
	} else {
		mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
	}
}

if (!gotLock) {
	app.quit();
} else {
	app.on("second-instance", () => {
		if (mainWindow) {
			if (mainWindow.isMinimized()) mainWindow.restore();
			mainWindow.focus();
		}
	});

	app.whenReady().then(() => {
		electronApp.setAppUserModelId("com.clxakz.scenery");
		createWindow();
		useApi();

		mainWindow?.webContents.once("did-finish-load", () => {
			autoUpdater.checkForUpdates();

			autoUpdater.on("download-progress", (progress: any) => {
				mainWindow?.webContents.send("update-download-progress", progress.percent);
			});
		});
	});
}

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
