import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { AIProviderProvider } from "./context/AIProviderContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AIProviderProvider>
        <App />
      </AIProviderProvider>

      <Toaster richColors position="top-right" />
    </BrowserRouter>
  </StrictMode>
);
0;
