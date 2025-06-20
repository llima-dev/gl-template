import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCode, faLink } from "@fortawesome/free-solid-svg-icons";

type ToolbarProps = {
  onAddPreparativo: () => void;
  onAbrirModalBlocoCodigo: () => void;
};

export default function Toolbar({ onAddPreparativo, onAbrirModalBlocoCodigo }: ToolbarProps) {
  return (
    <div className="d-flex gap-3 mb-3">
      <button className="btn btn-sm btn-outline-primary" onClick={onAddPreparativo}>
        <FontAwesomeIcon icon={faPlus} className="me-1" />
        Preparativo
      </button>
      <button className="btn btn-sm btn-outline-dark" onClick={onAbrirModalBlocoCodigo}>
        <FontAwesomeIcon icon={faCode} className="me-1" />
        Bloco de Código
      </button>
      <button className="btn btn-sm btn-outline-secondary" disabled>
        <FontAwesomeIcon icon={faLink} className="me-1" />
        Link auxiliar
      </button>
    </div>
  );
}
