import { Scene } from "@renderer/shared/types";
import { atom, useAtom } from "jotai";

// const mockScenes: Scene[] = [
// 	{
// 		id: "scene-1",
// 		name: "Sample Scene 1",
// 		websites: ["https://example.com", "https://example.org"],
// 		files: ["file1.txt", "file2.txt"],
// 	},
// 	{
// 		id: "scene-2",
// 		name: "Sample Scene 2",
// 		websites: ["https://example.net"],
// 		files: ["file3.txt"],
// 	},
// ];

const scenesATOM = atom<Scene[] | null>(null);

export default function useScenes() {
	const [scenes, setScenes] = useAtom(scenesATOM);

	const registerScene = ({ id, name, websites, files, workspaces }: Scene) => {
		const newScene: Scene = { id, name, websites, files, workspaces };
		setScenes((prev) => [...(prev ?? []), newScene]);
	};

	const deleteScene = (id: string) => {
		setScenes((prev) => prev!.filter((scene) => scene.id !== id));
	};

	return { scenes, setScenes, registerScene, deleteScene };
}
