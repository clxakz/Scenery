import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type TagsInputProps = {
	value?: string[];
	onChange?: (tags: string[]) => void;
	placeholder?: string;
	className?: string;
};

export default function TagsInput({ value, onChange, placeholder = "Add tag and press Enter", className }: TagsInputProps) {
	const [tags, setTags] = useState<string[]>(value ?? []);
	const [input, setInput] = useState("");

	const updateTags = (next: string[]) => {
		setTags(next);
		onChange?.(next);
	};

	const addTag = (tag: string) => {
		const clean = tag.trim();
		if (!clean) return;
		if (tags.includes(clean)) return;

		updateTags([...tags, clean]);
		setInput("");
	};

	const removeTag = (tag: string) => {
		updateTags(tags.filter((t) => t !== tag));
	};

	const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addTag(input);
		}

		if (e.key === "Backspace" && !input && tags.length) {
			removeTag(tags[tags.length - 1]);
		}
	};

	return (
		<div
			className={cn(
				"flex flex-wrap gap-1 rounded-md border border-input bg-background px-1 py-1 focus-within:ring-2 focus-within:ring-ring max-h-20 overflow-y-auto",
				className
			)}
		>
			{tags.map((tag) => (
				<Badge key={tag} variant="secondary" className="flex items-center gap-1 max-w-37.5">
					<span className="truncate">{tag}</span>
					<button type="button" onClick={() => removeTag(tag)} className="rounded-sm hover:bg-muted">
						<X className="h-3 w-3" />
					</button>
				</Badge>
			))}

			<Input
				value={input}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={onKeyDown}
				placeholder={placeholder}
				className="h-7 w-auto min-w-30 flex-1 border-none p-0 shadow-none focus-visible:ring-0 bg-transparent!"
			/>
		</div>
	);
}
