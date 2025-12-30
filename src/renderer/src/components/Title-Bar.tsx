export default function TitleBar() {
	return (
		<div className="h-6.5 w-full border-b bg-secondary window-drag flex items-center px-1">
			<p className="text-xs text-muted-foreground">{window.ipcRenderer.getAppVersion()}</p>

			<p className="text-sm justify-center flex flex-1">scenery</p>
		</div>
	);
}
