import { Moon, Plus, Search, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useDialog } from "@renderer/hooks/useDialog";
import useScenes from "@renderer/hooks/useScenes";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { useTheme } from "./Theme-Provider";
import { Input } from "./ui/input";
import { atom, useAtom } from "jotai";

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
					<p className="text-muted-foreground text-sm">
						{scenes?.length} {scenes?.length === 1 ? "scene" : "scenes"}
					</p>
				</section>

				<div className="relative flex items-center">
					<Search className="absolute left-2" size={16} />
					<Input
						placeholder="search scenes..."
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						className="w-fit pl-7"
					/>
				</div>
			</section>

			<section className="flex gap-1">
				<ToggleGroup type="single" defaultValue={theme} className="border">
					<ToggleGroupItem value="light" onClick={() => setTheme("light")}>
						<Sun />
					</ToggleGroupItem>

					<ToggleGroupItem value="dark" onClick={() => setTheme("dark")}>
						<Moon />
					</ToggleGroupItem>
				</ToggleGroup>

				<Button onClick={() => openDialog("New-Scene")}>
					New <Plus />
				</Button>
			</section>
		</header>
	);
}
