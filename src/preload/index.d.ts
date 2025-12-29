import { ElectronAPI } from "@electron-toolkit/preload";

declare global {
	interface Window {
		ipcRenderer: import("electron").IpcRenderer;
	}
}
