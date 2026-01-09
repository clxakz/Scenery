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
		<div className="h-6.5 w-full z-100 border-b bg-secondary window-drag flex items-center justify-center relative">
			<p className="text-xs text-muted-foreground absolute left-1">
				{progress === null
					? `${window.ipcRenderer.getAppVersion()}`
					: progress >= 100
						? "restart app to update"
						: `${Math.floor(progress)}% downloading update`}
			</p>

			<p className="text-sm">scenery</p>
		</div>
	);
}
