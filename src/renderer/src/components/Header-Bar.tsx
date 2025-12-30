import { Moon, Plus, Search, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useDialog } from "@renderer/hooks/useDialog";
import useScenes from "@renderer/hooks/useScenes";
import { useTheme } from "./Theme-Provider";
import { Input } from "./ui/input";
import { atom, useAtom } from "jotai";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Kbd, KbdGroup } from "./ui/kbd";

export const SearchQueryATOM = atom<string>("");

export default function HeaderBar() {
	const { openDialog } = useDialog();
	const { scenes } = useScenes();
	const { theme, setTheme } = useTheme();
	const [searchInput, setSearchInput] = useAtom(SearchQueryATOM);

	return (
		<header className="flex items-center justify-between">
			<section className="flex gap-5">
				<section className="flex flex-col">
					<h1 className="text-2xl leading-5">Scenes</h1>
					<p className="text-sm text-muted-foreground">
						{scenes?.length} {scenes?.length === 1 ? "scene" : "scenes"}
					</p>
				</section>

				<div className="relative flex items-center">
					<Search className="absolute left-2" size={16} />
					<Input
						placeholder="search scenes..."
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						className="shadow-none w-fit pl-7"
					/>
				</div>
			</section>

			<section className="flex gap-1">
				<div className="flex overflow-hidden border divide-x rounded-md divide-border">
					<Button className="rounded-none" variant={theme === "light" ? "secondary" : "ghost"} onClick={() => setTheme("light")}>
						<Sun />
					</Button>

					<Button className="rounded-none" variant={theme === "dark" ? "secondary" : "ghost"} onClick={() => setTheme("dark")}>
						<Moon />
					</Button>
				</div>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button onClick={() => openDialog("New-Scene")}>
							New <Plus />
						</Button>
					</TooltipTrigger>

					<TooltipContent side="bottom">
						<KbdGroup>
							<Kbd>Ctrl</Kbd>
							<span>+</span>
							<Kbd>N</Kbd>
						</KbdGroup>
					</TooltipContent>
				</Tooltip>
			</section>
		</header>
	);
}
