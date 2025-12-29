import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Field, FieldLabel, FieldError, FieldSet, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import { useDialog } from "@renderer/hooks/useDialog";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Plus, X } from "lucide-react";
import { TagsInput } from "../ui/tags-input";
import useScenes from "@renderer/hooks/useScenes";

type FormFields = {
	name: string;
	websites: string[];
};

export default function NewSceneForm() {
	const { closeDialog } = useDialog();
	const { registerScene } = useScenes();
	const [files, setFiles] = useState<string[]>([]);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<FormFields>({ defaultValues: { name: "", websites: [] } });

	const onSubmit: SubmitHandler<FormFields> = (data) => {
		registerScene({
			id: crypto.randomUUID(),
			name: data.name,
			websites: data.websites,
			files: files,
		});

		closeDialog();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<FieldSet>
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="scene_name">Scene Name</FieldLabel>
						<Input {...register("name", { required: "Scene name is required" })} id="scene_name" placeholder="enter scene name" />
						{errors.name && <FieldError>{errors.name.message}</FieldError>}
					</Field>

					<Field>
						<FieldLabel>Files & Apps</FieldLabel>

						<section className="flex flex-1 flex-col">
							<Button
								onClick={() =>
									window.ipcRenderer.invoke("choose-files").then((files) => setFiles((prev) => [...(prev || []), ...files]))
								}
								type="button"
								variant={"secondary"}
							>
								Add File <Plus />
							</Button>

							{files && files.length > 0 ? (
								<div className="flex flex-wrap gap-1 mt-2 max-h-20 overflow-auto">
									{files.map((file, index) => {
										const parts = file.split(/[/\\]/);
										const filename = parts[parts.length - 1];
										return <FileBadge key={index} filename={filename} index={index} setFiles={setFiles} />;
									})}
								</div>
							) : (
								<p className="text-muted-foreground text-sm">No files selected</p>
							)}
						</section>
					</Field>

					<Field>
						<FieldLabel htmlFor="websites">Websites</FieldLabel>

						<Controller
							control={control}
							name="websites"
							render={({ field }) => (
								<TagsInput value={field.value} onValueChange={field.onChange} placeholder="e.g. www.example.com" />
							)}
						/>
					</Field>

					<Field orientation={"horizontal"}>
						<Button type="submit">Submit</Button>
					</Field>
				</FieldGroup>
			</FieldSet>
		</form>
	);
}

function FileBadge({ filename, index, setFiles }: { filename: string; index: number; setFiles: React.Dispatch<React.SetStateAction<string[]>> }) {
	return (
		<Badge key={index} className="px-1">
			{filename}

			<Button
				size={"icon"}
				variant={"ghost"}
				className="size-4 rounded-full"
				onClick={() => {
					setFiles((prev) => prev?.filter((_, i) => i !== index) || null);
				}}
			>
				<X />
			</Button>
		</Badge>
	);
}
