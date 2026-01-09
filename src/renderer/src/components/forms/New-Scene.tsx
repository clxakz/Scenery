import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Field, FieldLabel, FieldError, FieldSet, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import { useDialog } from "@renderer/hooks/useDialog";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Plus, X } from "lucide-react";
import useScenes from "@renderer/hooks/useScenes";
import TagsInput from "../ui/tags-input";
import vscodeicon from "../../assets/vscode.svg";

type FormFields = {
	name: string;
	websites: string[];
	files: string[];
	workspaces: string[];
};

export default function NewSceneForm() {
	const { closeDialog } = useDialog();
	const { registerScene } = useScenes();

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<FormFields>({ defaultValues: { name: "", websites: [], files: [], workspaces: [] } });

	const onSubmit: SubmitHandler<FormFields> = (data) => {
		registerScene({
			id: crypto.randomUUID(),
			name: data.name,
			websites: data.websites,
			files: data.files,
			workspaces: data.workspaces,
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

						<Controller
							control={control}
							name="files"
							render={({ field }) => <FilesAndApps value={field.value} onChange={field.onChange} />}
						/>
					</Field>

					<Field>
						<FieldLabel>
							<div className="flex items-center gap-1 leading-1">
								<img src={vscodeicon} className="size-4" />
								VS Code Workspaces
							</div>
						</FieldLabel>

						<Controller
							control={control}
							name="workspaces"
							render={({ field }) => <Workspaces value={field.value} onChange={field.onChange} />}
						/>
					</Field>

					<Field>
						<FieldLabel htmlFor="websites">Websites</FieldLabel>

						<Controller
							control={control}
							name="websites"
							render={({ field }) => (
								<TagsInput value={field.value} onChange={field.onChange} placeholder="enter a url and press enter" />
							)}
						/>
					</Field>

					<Field orientation={"horizontal"}>
						<Button type="submit">Create</Button>
					</Field>
				</FieldGroup>
			</FieldSet>
		</form>
	);
}

function FileBadge({ filename, index, setBadges }: { filename: string; index: number; setBadges: React.Dispatch<React.SetStateAction<string[]>> }) {
	return (
		<Badge key={index} className="px-1">
			{filename}

			<Button
				type="button"
				className="size-3 rounded-full bg-transparent hover:text-destructive p-0!"
				onClick={() => {
					setBadges((prev) => prev?.filter((_, i) => i !== index) || null);
				}}
			>
				<X />
			</Button>
		</Badge>
	);
}

function FilesAndApps({ value, onChange }: { value: string[]; onChange: (files: string[]) => void }) {
	const [files, setFiles] = useState<string[]>(value);
	const [choosingFiles, setChoosingFiles] = useState<boolean>(false);

	useEffect(() => {
		onChange(files);
	}, [files]);

	return (
		<section className="flex flex-col flex-1">
			<Button
				onClick={() => {
					if (choosingFiles) return;

					setChoosingFiles(true);
					window.ipcRenderer
						.invoke("choose-files")
						.then((files) => {
							setFiles((prev) => [...(prev || []), ...files]);
						})
						.finally(() => {
							setChoosingFiles(false);
						});
				}}
				type="button"
				variant={"secondary"}
				disabled={choosingFiles}
			>
				Add File <Plus />
			</Button>

			{files && files.length > 0 ? (
				<div className="flex flex-wrap gap-1 mt-2 overflow-auto max-h-20">
					{files.map((file, index) => {
						const parts = file.split(/[/\\]/);
						const filename = parts[parts.length - 1];
						return <FileBadge key={index} filename={filename} index={index} setBadges={setFiles} />;
					})}
				</div>
			) : (
				<p className="text-sm text-muted-foreground">No files selected</p>
			)}
		</section>
	);
}

function Workspaces({ value, onChange }: { value: string[]; onChange: (files: string[]) => void }) {
	const [workspaces, setWorkspaces] = useState<string[]>(value);
	const [choosingFolders, setChoosingFolders] = useState<boolean>(false);

	useEffect(() => {
		onChange(workspaces);
	}, [workspaces]);

	return (
		<section className="flex flex-col flex-1">
			<Button
				onClick={() => {
					if (choosingFolders) return;

					setChoosingFolders(true);
					window.ipcRenderer
						.invoke("choose-folders")
						.then((folders) => {
							setWorkspaces((prev) => [...(prev || []), ...folders]);
						})
						.finally(() => {
							setChoosingFolders(false);
						});
				}}
				type="button"
				variant={"secondary"}
				disabled={choosingFolders}
			>
				Add Workspace <Plus />
			</Button>

			{workspaces && workspaces.length > 0 ? (
				<div className="flex flex-wrap gap-1 mt-2 overflow-auto max-h-20">
					{workspaces.map((file, index) => {
						const parts = file.split(/[/\\]/);
						const filename = parts[parts.length - 1];
						return <FileBadge key={index} filename={filename} index={index} setBadges={setWorkspaces} />;
					})}
				</div>
			) : (
				<p className="text-sm text-muted-foreground">No workspaces selected</p>
			)}
		</section>
	);
}
