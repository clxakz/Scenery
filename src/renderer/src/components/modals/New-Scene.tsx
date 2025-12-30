import NewSceneForm from "../forms/New-Scene";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export default function NewSceneDialog() {
	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Create a new scene</DialogTitle>
			</DialogHeader>

			<NewSceneForm />
		</DialogContent>
	);
}
