import { app, dialog, ipcMain, shell } from "electron";
import { type Scene } from "../renderer/src/shared/types";
import { readFile, writeFile } from "fs/promises";

const appdataPath = app.getPath("userData");
const scenesPath = `${appdataPath}/scenes.json`;

export function useApi() {
	ipcMain.handle("choose-files", async (_) => {
		const { canceled, filePaths } = await dialog.showOpenDialog({
			properties: ["openFile", "multiSelections"],
		});
		if (canceled) {
			return [];
		}

		return filePaths;
	});

	ipcMain.handle("run-scene", async (_, websites: string[], files: string[]) => {
		await Promise.all(websites.map((website) => shell.openExternal(website.trim().startsWith("http") ? website : `https://${website}`)));
		await Promise.all(files.map((file) => shell.openPath(file)));

		return true;
	});

	ipcMain.on("save-scenes", async (_, scenes: Scene[]) => {
		await writeFile(scenesPath, JSON.stringify(scenes, null, 2));
	});

	ipcMain.handle("fetch-scenes", async (_): Promise<Scene[]> => {
		try {
			const data = await readFile(scenesPath, "utf-8").then((res) => JSON.parse(res));
			return data as Scene[];
		} catch {
			return [];
		}
	});
}
