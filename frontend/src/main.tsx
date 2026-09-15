import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const MIN_LOADER_MS = 5000;
const loaderStart = performance.now();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

const elapsed = performance.now() - loaderStart;
window.setTimeout(() => {
  const loader = document.getElementById("initial-loader");
  if (!loader) return;
  loader.classList.add("loader-hidden");
  loader.addEventListener("transitionend", () => loader.remove(), { once: true });
}, Math.max(0, MIN_LOADER_MS - elapsed));
