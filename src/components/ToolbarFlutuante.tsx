import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faTrash, faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import {
  copiarParaClipboard,
  gerarMarkdown,
  sweetMessage,
  exportarParaJSON,
  importarDeJSON
} from "../helpers";
import { useTemplateStore } from "../context/TemplateContext";
import type { Template } from "../types";

export default function ToolbarFlutuante() {
  const { template, setTemplate, limpar } = useTemplateStore();
  const [mostrarArquivados, setMostrarArquivados] = useState(false);
  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState("");

  async function handleLimpar() {
    const result = await Swal.fire({
      title: "Limpar mural?",
      text: "Tem certeza que deseja limpar o mural? Essa ação não pode ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, limpar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      focusCancel: true,
    });

    if (result.isConfirmed) {
      limpar();
      Swal.fire({
        title: "Mural limpo!",
        text: "Seu mural foi apagado com sucesso.",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
      });
    }
  }

  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleExportar() {
    exportarParaJSON(template, template.nomeTarefa || "template");
  }

  function handleImportar(e: React.ChangeEvent<HTMLInputElement>) {
    importarDeJSON(e, (json: Template) => setTemplate(json));
  }

  function arquivarTemplate() {
    if (!template.arquivados) template.arquivados = [];
    const novosArquivados = [...template.arquivados, { ...template }];

    const modeloVazio: Template = {
      nomeTarefa: "",
      escopo: "",
      impacto: "",
      criterios: [],
      passos: [],
      preparativos: [],
      blocosDeCodigo: [],
      comentariosAtencao: [],
      linksExternos: [],
      navegadores: { chrome: false, edge: false },
      bancos: { sqlserver: false, oracleIso: false, postgres: false, oracleUtf: false },
      incluirFluxograma: false,
      arquivados: novosArquivados,
    };

    setTemplate(modeloVazio);
    sweetMessage("Template arquivado!");
  }

  function desarquivarTemplate(idx: number) {
    if (!template.arquivados) return;

    const novosArquivados = [...template.arquivados];
    const desarquivado = novosArquivados.splice(idx, 1)[0];

    setTemplate({
      ...desarquivado,
      arquivados: novosArquivados,
    });

    setMostrarArquivados(false);
  }

  function removerArquivado(idx: number) {
    if (!template.arquivados) return;

    const novosArquivados = [...template.arquivados];
    novosArquivados.splice(idx, 1);

    setTemplate({
      ...template,
      arquivados: novosArquivados,
    });
  }

  const arquivadosFiltrados = template.arquivados?.filter(
    (t) =>
      (t.nomeTarefa || "").toLowerCase().includes(busca.toLowerCase()) ||
      (t.escopo || "").toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <>
      <div
        className="position-fixed d-flex flex-column align-items-end"
        style={{
          bottom: "0.3rem",
          right: "0.2rem",
          zIndex: 2000,
        }}
      >
        {/* Botão toggle */}
        <button
          className="btn btn-dark mb-2"
          style={{ borderRadius: 24, width: 48, height: 48 }}
          onClick={() => setAberto(!aberto)}
          aria-expanded={aberto}
          aria-label={aberto ? "Fechar toolbar" : "Abrir toolbar"}
        >
          <FontAwesomeIcon icon={aberto ? faChevronDown : faChevronUp} />
        </button>

        {/* Conteúdo retrátil */}
        <div
          style={{
            maxHeight: aberto ? "400px" : "0",
            overflow: "hidden",
            transition: "max-height 0.3s ease",
            width: 190,
            background: "#23272f",
            borderRadius: 16,
            boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
            padding: aberto ? "1.5rem 1rem" : "0 1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <button className="btn btn-dark btn-block" onClick={handleExportar}>
            Exportar JSON
          </button>

          <button
            className="btn btn-dark btn-block"
            onClick={() => inputRef.current?.click()}
          >
            Importar JSON
          </button>
          <input
            type="file"
            accept=".json"
            ref={inputRef}
            style={{ display: "none" }}
            onChange={handleImportar}
          />

          <button className="btn btn-dark" onClick={arquivarTemplate}>
            Arquivar
          </button>

          <button
            className="btn btn-dark"
            onClick={() => setMostrarArquivados(true)}
            disabled={!template.arquivados || template.arquivados.length === 0}
          >
            Arquivados ({template.arquivados?.length || 0})
          </button>

          <button
            className="btn btn-dark btn-block"
            onClick={() => copiarParaClipboard(gerarMarkdown(template))}
          >
            <FontAwesomeIcon icon={faClipboard} className="me-2" />
            Copiar
          </button>

          <button className="btn btn-dark btn-sm btn-block text-danger" onClick={handleLimpar}>
            <FontAwesomeIcon icon={faTrash} className="me-2" />
            Limpar templates
          </button>
          <small className="copyright d-flex justify-content-center">
            Desenvolvido por Lindomar Lima (ACT)
          </small>
        </div>
      </div>

      {mostrarArquivados && (
        <>
          {/* Overlay */}
          <div
            className="modal-backdrop fade show"
            onClick={() => setMostrarArquivados(false)}
          />
          {/* Modal */}
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Templates Arquivados</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Fechar"
                    onClick={() => setMostrarArquivados(false)}
                  />
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Buscar por nome ou escopo..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    autoFocus
                  />
                  {arquivadosFiltrados?.length ? (
                    <ul className="list-group">
                      {arquivadosFiltrados.map((t) => {
                        const idxOriginal =
                          template.arquivados?.findIndex((arq) => arq === t) ??
                          -1;

                        return (
                          <li
                            key={idxOriginal}
                            className="list-group-item d-flex justify-content-between align-items-start"
                          >
                            <div>
                              <strong>{t.nomeTarefa || "(sem nome)"}</strong>
                              <br />
                              <small className="text-muted">
                                {t.escopo || "Sem escopo"}
                              </small>
                            </div>
                            <div
                              className="btn-group btn-group-sm"
                              role="group"
                              aria-label="Ações arquivado"
                            >
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => removerArquivado(idxOriginal)}
                                title="Remover permanentemente"
                                disabled={idxOriginal === -1}
                              >
                                Remover
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={() => desarquivarTemplate(idxOriginal)}
                                title="Desarquivar"
                                disabled={idxOriginal === -1}
                              >
                                Desarquivar
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p>Nenhum template arquivado.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
