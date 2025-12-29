import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useDialog } from "@renderer/hooks/useDialog";
import useScenes from "@renderer/hooks/useScenes";

export default function HeaderBar() {
	const { openDialog } = useDialog();
	const { scenes } = useScenes();

	return (
		<header className="flex items-center justify-between">
			<section className="flex flex-col">
				<h1 className="text-2xl leading-5">Scenes</h1>
				<p className="text-muted-foreground text-sm">
					{scenes?.length} {scenes?.length === 1 ? "scene" : "scenes"}
				</p>
			</section>

			<Button onClick={() => openDialog("New-Scene")}>
				New <Plus />
			</Button>
		</header>
	);
}
