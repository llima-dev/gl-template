import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { copiarParaClipboard } from "../helpers";

interface MarkdownViewerModalProps {
  markdown: string;
  onClose: () => void;
}

export default function MarkdownViewerModal({
  markdown,
  onClose,
}: MarkdownViewerModalProps) {
  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      style={{ zIndex: 2000 }}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div
          className="modal-content"
          style={{
            background: "#1e1e1e",
            color: "#dcdcdc",
            fontFamily: "Consolas, monospace",
            border: "1px solid #333",
            boxShadow: "0 0 20px rgba(0,0,0,0.6)",
          }}
        >
          {/* Cabeçalho */}
          <div
            className="modal-header border-secondary d-flex justify-content-between align-items-center"
            style={{ background: "#252526", color: "#ccc" }}
          >
            <h5 className="modal-title d-flex align-items-center mb-0">
              <i className="fas fa-code me-2 text-info"></i>
              Visualizador de Markdown
            </h5>

            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-light btn-sm"
                onClick={() => copiarParaClipboard(markdown)}
                title="Copiar Markdown"
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>

              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={onClose}
                title="Fechar"
              >
                <FontAwesomeIcon icon={faEyeSlash} />
              </button>
            </div>
          </div>

          {/* Corpo */}
          <div
            className="modal-body"
            style={{
              maxHeight: "80vh",
              overflowY: "auto",
              background: "#1e1e1e",
            }}
          >
            <pre
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                color: "#9cdcfe",
              }}
            >
              {markdown}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
