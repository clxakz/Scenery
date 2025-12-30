import { useEffect } from "react";
import HeaderBar from "./components/Header-Bar";
import NewSceneDialog from "./components/modals/New-Scene";
import Scenes from "./components/Scenes";
import TitleBar from "./components/Title-Bar";
import { useDialog } from "./hooks/useDialog";
import useScenes from "./hooks/useScenes";
import { useHotkeys } from "react-hotkeys-hook";

export default function Layout() {
	const { addModel, openDialog } = useDialog();
	const { scenes, setScenes } = useScenes();

	addModel({ value: "New-Scene", component: NewSceneDialog });
	useHotkeys("ctrl+n", () => openDialog("New-Scene"));

	useEffect(() => {
		if (scenes) return;
		window.ipcRenderer.invoke("fetch-scenes").then(setScenes);
	}, []);

	useEffect(() => {
		if (!scenes) return;
		window.ipcRenderer.send("save-scenes", scenes);
	}, [scenes]);

	return (
		<div className="flex flex-col h-screen bg-background">
			<TitleBar />

			<main className="flex flex-col flex-1 p-4 space-y-4 overflow-auto">
				<HeaderBar />
				<Scenes />
			</main>
		</div>
	);
}
