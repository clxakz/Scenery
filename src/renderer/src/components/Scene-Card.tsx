import { Scene } from "@renderer/shared/types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Loader, Play, Trash } from "lucide-react";
import useScenes from "@renderer/hooks/useScenes";
import { useState } from "react";

export default function SceneCard({ id, name, websites, files }: Scene) {
	const { deleteScene } = useScenes();
	const [loading, setLoading] = useState<boolean>(false);

	return (
		<div className="bg-card border rounded-md flex flex-col overflow-hidden min-h-50">
			<section className="flex flex-col flex-1 px-4 py-2 overflow-y-auto gap-1">
				<h2 className="text-lg font-semibold truncate line-clamp-2 text-wrap">{name}</h2>

				{websites.length > 0 ? (
					<>
						<p className="text-muted-foreground text-sm">websites</p>
						<div className="flex flex-wrap gap-1">
							{websites.map((website, index) => (
								<Badge key={index} variant={"secondary"}>
									{website}
								</Badge>
							))}
						</div>
					</>
				) : (
					<p className="text-muted-foreground text-sm">0 websites</p>
				)}

				{files.length > 0 ? (
					<>
						<p className="text-muted-foreground text-sm">files</p>
						<div className="flex flex-wrap gap-1">
							{files.slice(0, 5).map((file, index) => {
								const parts = file.split(/[/\\]/);
								const filename = parts[parts.length - 1];
								return <Badge key={index}>{filename}</Badge>;
							})}

							{files.length > 5 && <Badge>+{files.length - 5} more</Badge>}
						</div>
					</>
				) : (
					<p className="text-muted-foreground text-sm">0 files</p>
				)}
			</section>

			<section className="border-t flex">
				<Button
					variant={"ghost"}
					className="rounded-none flex-1 border-r"
					onClick={() => {
						setLoading(true);
						window.ipcRenderer.invoke("run-scene", websites, files).then(() => setLoading(false));
					}}
				>
					{loading ? <Loader className="animate-spin" /> : <Play />}
				</Button>

				<Button variant={"ghost"} className="rounded-none flex-1" onClick={() => deleteScene(id)}>
					<Trash />
				</Button>
			</section>
		</div>
	);
}
