import { app, dialog, ipcMain, shell } from "electron";
import { type Scene } from "../renderer/src/shared/types";
import { access, readFile, writeFile } from "fs/promises";
import { exec } from "child_process";

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

	ipcMain.handle("choose-folders", async (_) => {
		const { canceled, filePaths } = await dialog.showOpenDialog({
			properties: ["openDirectory", "multiSelections"],
		});
		if (canceled) {
			return [];
		}

		return filePaths;
	});

	ipcMain.handle("run-scene", async (_, websites: string[], files: string[], workspaces: string[]) => {
		await Promise.all(websites.map((website) => shell.openExternal(website.trim().startsWith("http") ? website : `https://${website}`)));
		await Promise.all(files.map((file) => shell.openPath(file)));
		await Promise.all(
			workspaces.map(async (workspace) => {
				try {
					await access(workspace);
					exec(`code "${workspace}"`, (err) => {
						if (!err) return;
						dialog.showErrorBox("An error occured while launching one of the workspaces", err.message);
					});
				} catch (err: any) {
					console.log(err);
				}
			})
		);

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
