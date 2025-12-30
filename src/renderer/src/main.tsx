import "./assets/index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Layout from "./Layout";
import { DialogManager } from "./hooks/useDialog";
import { ThemeProvider } from "./components/Theme-Provider";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider defaultTheme="dark">
			<DialogManager />
			<Layout />
		</ThemeProvider>
	</StrictMode>
);
