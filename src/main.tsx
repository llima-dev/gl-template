import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from './App.tsx'
import { TemplateProvider } from "./context/TemplateContext";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TemplateProvider>
      <App />
    </TemplateProvider>
  </StrictMode>,
)
