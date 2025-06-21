import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useTemplateStore } from "./context/TemplateContext";
import CamposBasicos from "./components/CamposBasicos";
import Criterios from "./components/Criterios";
import Passos from "./components/Passos";
import Impacto from "./components/Impacto";
import AmbienteTestado from "./components/AmbienteTestado";
import Comentario from "./components/Comentario";
import Preparativos from "./components/Preparativos";
import ToolbarFlutuante from "./components/ToolbarFlutuante";
import MarkdownPreview from "./components/MarkdownPreview";

import "./App.css"

import { gerarMarkdown } from "./helpers";

export default function App() {
  const { template } = useTemplateStore();

  useEffect(() => {
    document.title = template.nomeTarefa
      ? `Template | ${template.nomeTarefa}`
      : "Template";
  }, [template.nomeTarefa]);

  return (
    <div className="d-flex justify-content-center align-items-start min-vh-100 bg-light">
      <div className="mx-auto px-3" style={{ maxWidth: "100%", width: "100%" }}>
        <div className="card shadow-sm card-content">
          <div className="card-body">
            <div className="row" style={{ height: "80vh" }}>
              {/* Lado ESQUERDO: conteúdo editável com scroll */}
              <div className="col-12 col-lg-7 col-scroll">
                <h1 className="h4">
                  Gerador de Template GitLab
                  {template.nomeTarefa && (
                    <span
                      className="ms-2 text-muted"
                      style={{ fontWeight: 400 }}
                    >
                      ({template.nomeTarefa})
                    </span>
                  )}
                </h1>
                <CamposBasicos />
                <Comentario />
                <hr className="my-4" />
                <Preparativos />
                <hr className="my-4" />
                <Passos />
                <hr className="my-4" />
                <Criterios />
                <hr className="my-4" />
                <Impacto />
                <hr className="my-4" />
                <AmbienteTestado />
                <ToolbarFlutuante />
                <div className="mt-4">
                  <label className="form-label fw-bold">Markdown Gerado</label>
                  <textarea
                    className="form-control"
                    rows={12}
                    readOnly
                    style={{
                      fontFamily: "monospace",
                      background: "#222",
                      color: "#fff",
                    }}
                    value={gerarMarkdown(template)}
                  />
                </div>
              </div>

              {/* Lado DIREITO: Preview ao vivo com scroll */}
              <div className="col-12 col-lg-5 col-scroll">
                <label className="form-label fw-bold">Preview ao vivo</label>
                <div
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    background: "#fafbfc",
                    minHeight: 400,
                    padding: 24,
                    marginTop: 8,
                    boxShadow: "0 2px 10px #0001",
                    overflow: "auto",
                  }}
                >
                  <MarkdownPreview markdown={template.nomeTarefa ? gerarMarkdown(template) : ''} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}