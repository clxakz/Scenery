import React, { useEffect } from "react";
import { atom, useAtom } from "jotai";
import { Dialog } from "../components/ui/dialog";

type DialogModel = {
	value: string;
	component: React.ComponentType<any>;
};

type OpenedModal = {
	value: string;
	props?: Record<string, any>;
};

const modelsATOM = atom<DialogModel[]>([]);
const dialogOpenATOM = atom(false);
const currentModelAtom = atom<OpenedModal | undefined>(undefined);

export const useDialog = () => {
	const [models, setModels] = useAtom(modelsATOM);
	const [dialogOpen, setDialogOpen] = useAtom(dialogOpenATOM);
	const [currentModel, setCurrentModel] = useAtom(currentModelAtom);

	const addModel = (model: DialogModel) => {
		setModels((prev) => {
			if (prev.find((m) => m.value === model.value)) return prev;
			return [...prev, model];
		});
	};

	const openDialog = (value: string, props?: Record<string, any>) => {
		const model = models.find((m) => m.value === value);
		if (model) {
			setCurrentModel({ value, props });
			setDialogOpen(true);
		} else {
			console.warn(`Modal with value '${value}' not found.`);
		}
	};

	const closeDialog = () => {
		setDialogOpen(false);
	};

	return {
		addModel,
		openDialog,
		closeDialog,
		dialogOpen,
		currentModel,
		models,
		setDialogOpen,
		setCurrentModel,
	};
};

export const DialogManager = () => {
	const { dialogOpen, setDialogOpen, currentModel, setCurrentModel, models } = useDialog();

	useEffect(() => {
		let timeoutId: ReturnType<typeof setTimeout>;

		if (!dialogOpen && currentModel !== undefined) {
			timeoutId = setTimeout(() => setCurrentModel(undefined), 300);
		}

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, [dialogOpen, currentModel, setCurrentModel]);

	if (!currentModel) return null;

	const ModalComponent = models.find((m) => m.value === currentModel.value)?.component;
	if (!ModalComponent) return null;

	return (
		<Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
			<ModalComponent {...currentModel.props} />
		</Dialog>
	);
};
