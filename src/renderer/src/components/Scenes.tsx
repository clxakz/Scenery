import useScenes from "@renderer/hooks/useScenes";
import SceneCard from "./Scene-Card";

export default function Scenes() {
	const { scenes } = useScenes();

	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto">
			{scenes?.map((scene, index) => (
				<SceneCard key={index} {...scene} />
			))}
		</div>
	);
}
