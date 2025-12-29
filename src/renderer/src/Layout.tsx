import { useEffect } from "react";
import HeaderBar from "./components/Header-Bar";
import NewSceneDialog from "./components/modals/New-Scene";
import Scenes from "./components/Scenes";
import TitleBar from "./components/Title-Bar";
import { useDialog } from "./hooks/useDialog";
import useScenes from "./hooks/useScenes";

export default function Layout() {
	const { addModel } = useDialog();
	const { scenes, setScenes } = useScenes();
	addModel({ value: "New-Scene", component: NewSceneDialog });

	useEffect(() => {
		if (scenes) return;
		window.ipcRenderer.invoke("fetch-scenes").then(setScenes);
	}, []);

	useEffect(() => {
		if (!scenes) return;
		window.ipcRenderer.send("save-scenes", scenes);
	}, [scenes]);

	return (
		<div className="bg-background h-screen flex flex-col">
			<TitleBar />

			<main className="flex-1 flex flex-col p-4 space-y-4 overflow-auto">
				<HeaderBar />
				<Scenes />
			</main>
		</div>
	);
}
