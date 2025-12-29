import { app, BrowserWindow } from "electron";
import { join } from "path";
import { electronApp, is } from "@electron-toolkit/utils";
import { useApi } from "./api";

function createWindow(): void {
	const mainWindow = new BrowserWindow({
		width: 930,
		height: 600,
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
		mainWindow.show();
	});

	mainWindow.setMenu(null);

	if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
		mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
		mainWindow.webContents.openDevTools({ mode: "detach" });
	} else {
		mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
	}
}

app.whenReady().then(() => {
	electronApp.setAppUserModelId("com.clxakz.scenery");
	createWindow();
	useApi();
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
