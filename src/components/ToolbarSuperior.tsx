import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExport,
  faFileImport,
  faBoxArchive,
  faFolderOpen,
  faEraser,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { 
    sweetMessage,
    exportarParaJSON,
    importarDeJSON,
    gerarMarkdown,
    copiarParaClipboard
} from "../helpers";
import { useTemplateStore } from "../context/TemplateContext";
import type { Template } from "../types";
import ArquivadosTable from "./ArquivadosTable";

export default function ToolbarSuperior() {
  const { template, setTemplate, limpar } = useTemplateStore();
  const [mostrarArquivados, setMostrarArquivados] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      bancos: {
        sqlserver: false,
        oracleIso: false,
        postgres: false,
        oracleUtf: false,
      },
      incluirFluxograma: false,
      arquivados: novosArquivados,
    };

    setTemplate(modeloVazio);
    sweetMessage("Template arquivado!");
  }

  async function handleLimpar() {
    const result = await Swal.fire({
      title: "Limpar editor?",
      text: "Isso apagará o conteúdo atual, mas manterá seus templates arquivados.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, limpar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      limpar();
      Swal.fire({
        title: "Editor limpo!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  }

  // ---- Modal helpers ----
  function desarquivarTemplate(idx: number) {
    if (!template.arquivados) return;
    const novosArquivados = [...template.arquivados];
    const desarquivado = novosArquivados.splice(idx, 1)[0];
    const atual = { ...template };
    delete atual.arquivados;
    novosArquivados.unshift(atual);
    setTemplate({ ...desarquivado, arquivados: novosArquivados });
    setMostrarArquivados(false);
    sweetMessage("Template alternado!");
  }

  function removerArquivado(idx: number) {
    if (!template.arquivados) return;
    const novosArquivados = [...template.arquivados];
    novosArquivados.splice(idx, 1);
    setTemplate({ ...template, arquivados: novosArquivados });
  }

  // ---- Render ----
  return (
    <>
      {/* Toolbar compacta estilo Word */}
      <div
        className="btn-group btn-group-sm shadow-sm border"
        role="group"
        aria-label="Ações Template GitLab"
      >
        <button
          className="btn btn-light"
          onClick={arquivarTemplate}
          title="Arquivar template atual"
        >
          <FontAwesomeIcon icon={faBoxArchive} />
        </button>

        <button
          className="btn btn-light"
          onClick={handleExportar}
          title="Exportar JSON"
        >
          <FontAwesomeIcon icon={faFileExport} />
        </button>

        <button
          className="btn btn-light"
          onClick={() => inputRef.current?.click()}
          title="Importar JSON"
        >
          <FontAwesomeIcon icon={faFileImport} />
        </button>
        <input
          type="file"
          accept=".json"
          ref={inputRef}
          style={{ display: "none" }}
          onChange={handleImportar}
        />

        <button
          className="btn btn-light"
          onClick={() => setMostrarArquivados(true)}
          title="Abrir arquivados"
          disabled={!template.arquivados || template.arquivados.length === 0}
        >
          <FontAwesomeIcon icon={faFolderOpen} />
        </button>

        {/* --- NOVO BOTÃO DE COPIAR --- */}
        <button
          className="btn btn-light"
          onClick={() => copiarParaClipboard(gerarMarkdown(template))}
          title="Copiar Markdown"
        >
          <FontAwesomeIcon icon={faCopy} />
        </button>

        <button
          className="btn btn-light text-danger"
          onClick={handleLimpar}
          title="Limpar editor"
        >
          <FontAwesomeIcon icon={faEraser} />
        </button>
      </div>

      {/* Modal de arquivados */}
      {mostrarArquivados && (
        <>
          <div
            className="modal-backdrop fade show"
            onClick={() => setMostrarArquivados(false)}
          />
          <div className="modal fade show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-lg">
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
                  {template.arquivados?.length ? (
                    <ArquivadosTable
                      templates={template.arquivados}
                      onDesarquivar={desarquivarTemplate}
                      onRemover={async (idx: number) => {
                        const result = await Swal.fire({
                          title: `Remover template definitivamente?`,
                          text: "Essa ação é irreversível!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Sim, remover",
                          cancelButtonText: "Cancelar",
                          reverseButtons: true,
                        });

                        if (result.isConfirmed) {
                          removerArquivado(idx);
                          sweetMessage("Arquivados removidos!");
                        }
                      }}
                    />
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
