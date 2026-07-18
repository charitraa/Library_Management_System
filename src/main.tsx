import { createRoot } from "react-dom/client";
import App from "./pages/App";
import "./global.css";
import { initTheme } from "./lib/theme";

initTheme();

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
