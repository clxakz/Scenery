import { useEffect, useState } from "react";

export default function TitleBar() {
	const [progress, setProgress] = useState<number | null>(null);

	useEffect(() => {
		window.ipcRenderer.on("update-download-progress", (_, progress) => {
			setProgress(progress);
			console.log("Download progress:", progress);
		});
	}, []);

	return (
		<div className="h-6.5 w-full border-b bg-secondary window-drag flex items-center px-1">
			{progress === null ? (
				<p className="text-xs text-muted-foreground">{window.ipcRenderer.getAppVersion()}</p>
			) : progress >= 100 ? (
				<p className="text-xs text-muted-foreground">restart app to update</p>
			) : (
				<p className="text-xs text-muted-foreground">{Math.floor(progress)}% downloading update</p>
			)}

			<p className="flex justify-center flex-1 text-sm">scenery</p>
		</div>
	);
}
