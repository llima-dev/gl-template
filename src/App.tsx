import { useEffect, useState } from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom } from "@fortawesome/free-solid-svg-icons";

import { KanbanTemplateProvider } from "./context/KanbanTemplateContext";
import FormKanban from "./components/FormKanban";

import "./App.css"

import { gerarMarkdown } from "./helpers";

export default function App() {
  const { template, limparCampos } = useTemplateStore();
  const [aba, setAba] = useState<"gitlab" | "kanban">("gitlab");

  useEffect(() => {
    document.title = template.nomeTarefa
      ? `Template | ${template.nomeTarefa}`
      : "Template";
  }, [template.nomeTarefa]);

  return (
    <div className="d-flex justify-content-center align-items-start min-vh-100 bg-light">
      <div className="mx-auto px-3" style={{ maxWidth: "100%", width: "100%" }}>
        {/* --- AQUI COMEÇA O COMPONENTE DE ABAS --- */}
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${aba === "gitlab" ? "active" : ""}`}
              onClick={() => setAba("gitlab")}
              type="button"
            >
              Template GitLab
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${aba === "kanban" ? "active" : ""}`}
              onClick={() => setAba("kanban")}
              type="button"
            >
              Template Kanban
            </button>
          </li>
        </ul>
        {/* --- FIM DO COMPONENTE DE ABAS --- */}

        {/* Renderiza o conteúdo baseado na aba selecionada */}
        {aba === "gitlab" ? (
          <div className="card shadow-sm card-content">
            <div className="card-body">
              <div className="row" style={{ height: "80vh" }}>
                {/* Lado ESQUERDO: conteúdo editável com scroll */}
                <div className="col-12 col-lg-7 col-scroll">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h1 className="h4" style={{ maxWidth: '60vw' }}>
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
                    <button
                      className="btn btn-outline-danger btn-sm kanban-toolbar-btn"
                      type="button"
                      onClick={limparCampos}
                      title="Limpar formulário"
                    >
                      <FontAwesomeIcon icon={faBroom} />
                    </button>
                  </div>
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
                    <label className="form-label fw-bold">
                      Markdown Gerado
                    </label>
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
                    <MarkdownPreview
                      markdown={
                        template.nomeTarefa ? gerarMarkdown(template, true) : ""
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <KanbanTemplateProvider>
            <div className="card shadow-sm card-content">
              <div className="card-body">
                <h2 className="h4">Template Kanban</h2>
                <FormKanban />
              </div>
            </div>
          </KanbanTemplateProvider>
        )}
      </div>
    </div>
  );
}