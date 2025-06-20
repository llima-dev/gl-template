import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faTrash } from "@fortawesome/free-solid-svg-icons";
import { copiarParaClipboard, gerarMarkdown } from "../helpers";
import { useTemplateStore } from "../context/TemplateContext";

export default function ToolbarFlutuante() {
  const { template } = useTemplateStore();

  return (
    <>
      <div
        className="position-fixed"
        style={{
          bottom: "0.3rem",
          right: "0.2rem",
          zIndex: 2000,
          background: "#23272f",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
          padding: "1.5rem 1rem",
          minWidth: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: "0.5rem",
        }}
      >
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
    </>
  );
}
