import "./assets/index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Layout from "./Layout";
import { DialogManager } from "./hooks/useDialog";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<DialogManager />
		<Layout />
	</StrictMode>
);
