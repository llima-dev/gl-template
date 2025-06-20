import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faClipboard, faTrash } from "@fortawesome/free-solid-svg-icons";
import { copiarParaClipboard, gerarMarkdown } from "../helpers";
import { useTemplateStore } from "../context/TemplateContext";
import MarkdownPreview from "./MarkdownPreview";

export default function ToolbarFlutuante() {
  const { template } = useTemplateStore();
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <div
        className="position-fixed"
        style={{
          top: "2rem",
          right: "2rem",
          zIndex: 2000,
          background: "#23272f",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
          padding: "1.5rem 1rem",
          minWidth: 160,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: "0.5rem",
        }}
      >
        <button
          className="btn btn-dark btn-block mb-2"
          onClick={() => setShowPreview(true)}
        >
          <FontAwesomeIcon icon={faEye} className="me-2" />
          Visualizar
        </button>
        <button
          className="btn btn-dark btn-block text-start"
          onClick={() => copiarParaClipboard(gerarMarkdown(template))}
        >
          <FontAwesomeIcon icon={faClipboard} className="me-2" />
          Copiar
        </button>
        <button
          className="btn btn-dark btn-block text-start text-danger"
          disabled
        >
          <FontAwesomeIcon icon={faTrash} className="me-2" />
          Limpar Rascunho
        </button>
      </div>

      {showPreview && (
        <>
          {/* Overlay */}
          <div
            style={{
              position: "fixed",
              inset: 0, // top:0, right:0, bottom:0, left:0
              background: "rgba(0,0,0,0.6)",
              zIndex: 2048,
            }}
          />
          {/* Modal */}
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 2050,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "auto",
            }}
          >
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Preview do Markdown</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowPreview(false)}
                  />
                </div>
                <div className="modal-body">
                  <MarkdownPreview markdown={gerarMarkdown(template)} />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowPreview(false)}
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
