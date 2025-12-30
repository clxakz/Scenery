import useScenes from "@renderer/hooks/useScenes";
import SceneCard from "./Scene-Card";
import { useAtomValue } from "jotai";
import { SearchQueryATOM } from "./Header-Bar";
import { AnimatePresence, motion } from "motion/react";

export default function Scenes() {
	const { scenes } = useScenes();
	const searchInput = useAtomValue(SearchQueryATOM);

	return (
		<div className="overflow-y-auto scrollbar-hidden">
			<motion.div className="grid grid-cols-2 gap-2 overflow-hidden sm:grid-cols-3">
				<AnimatePresence mode="popLayout">
					{scenes
						?.filter((scene) => scene.name.toLowerCase().includes(searchInput.toLowerCase()))
						.map((scene, index) => (
							<SceneCard key={scene.id} {...scene} index={index} />
						))}
				</AnimatePresence>
			</motion.div>
		</div>
	);
}
