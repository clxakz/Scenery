import { Scene } from "@renderer/shared/types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Loader, Play, Trash } from "lucide-react";
import useScenes from "@renderer/hooks/useScenes";
import { useState } from "react";
import { motion } from "motion/react";
import { BiLogoVisualStudio } from "react-icons/bi";

export default function SceneCard({ id, name, websites, files, workspaces, index }: Scene & { index: number }) {
	const { deleteScene } = useScenes();
	const [loading, setLoading] = useState<boolean>(false);

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			transition={{ delay: index * 0.1 }}
			className="flex flex-col overflow-hidden border rounded-md bg-card min-h-80 max-h-80"
		>
			<section className="flex flex-col flex-1 gap-1 px-4 py-2 overflow-y-auto scrollbar-hidden">
				<h2 className="text-lg font-semibold truncate line-clamp-2 text-wrap shrink-0">{name}</h2>

				{websites.length > 0 ? (
					<>
						<p className="text-sm text-muted-foreground">websites</p>
						<div className="flex flex-wrap gap-1">
							{websites.slice(0, 3).map((website, index) => (
								<Badge key={index} variant={"secondary"} className="max-w-37.5">
									<span className="truncate">{website}</span>
								</Badge>
							))}

							{websites.length > 3 && <Badge>+{websites.length - 3} more</Badge>}
						</div>
					</>
				) : (
					<p className="text-sm text-muted-foreground">0 websites</p>
				)}

				{files.length > 0 ? (
					<>
						<p className="text-sm text-muted-foreground">files</p>
						<div className="flex flex-wrap gap-1">
							{files.slice(0, 3).map((file, index) => {
								const parts = file.split(/[/\\]/);
								const filename = parts[parts.length - 1];
								return <Badge key={index}>{filename}</Badge>;
							})}

							{files.length > 3 && <Badge variant={"secondary"}>+{files.length - 3} more</Badge>}
						</div>
					</>
				) : (
					<p className="text-sm text-muted-foreground">0 files</p>
				)}

				{workspaces.length > 0 ? (
					<>
						<div className="flex items-center gap-1">
							<BiLogoVisualStudio size={15} className="text-blue-500" />
							<p className="text-sm text-muted-foreground">workspaces</p>
						</div>
						<div className="flex flex-wrap gap-1">
							{workspaces.slice(0, 3).map((file, index) => {
								const parts = file.split(/[/\\]/);
								const filename = parts[parts.length - 1];
								return (
									<Badge key={index} className="bg-blue-400">
										{filename}
									</Badge>
								);
							})}

							{workspaces.length > 3 && <Badge variant={"secondary"}>+{workspaces.length - 3} more</Badge>}
						</div>
					</>
				) : (
					<p className="text-sm text-muted-foreground">0 workspaces</p>
				)}
			</section>

			<section className="flex border-t divide-x">
				<Button
					variant={"ghost"}
					className="flex-1 rounded-none"
					onClick={() => {
						setLoading(true);
						window.ipcRenderer.invoke("run-scene", websites, files, workspaces).then(() => setLoading(false));
					}}
				>
					{loading ? <Loader className="animate-spin" /> : <Play />}
				</Button>

				<Button variant={"ghost"} className="flex-1 rounded-none" onClick={() => deleteScene(id)}>
					<Trash />
				</Button>
			</section>
		</motion.div>
	);
}
