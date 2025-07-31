import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setupGlobalErrorHandlers } from "./lib/error-handler";

// Setup global error handlers to prevent crashes
setupGlobalErrorHandlers();

createRoot(document.getElementById("root")!).render(<App />);
