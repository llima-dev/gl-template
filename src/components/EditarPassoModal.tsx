import { useState, useEffect } from "react";
import { useTemplateStore } from '../context/TemplateContext';

type Props = {
  id: string;
  onClose: () => void;
};

export default function EditarPassoModal({ id, onClose }: Props) {
  const { template, setTemplate } = useTemplateStore();

  const passo = template.passos.find((p) => p.id === id);

  const [texto, setTexto] = useState("");
  const [critico, setCritico] = useState(false);
  const [vinculados, setVinculados] = useState<number[]>([]);

  useEffect(() => {
    if (passo) {
      setTexto(passo.texto);
      setCritico(passo.critico ?? false);
      setVinculados(passo.criteriosVinculados ?? []);
    }
  }, [passo]);

  if (!passo) return null;

  function toggleCriterio(idx: number) {
    setVinculados((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  }

  function salvar() {
    const novosPassos = template.passos.map((p) =>
      p.id === id
        ? {
            ...p,
            texto: texto.trim(),
            critico,
            criteriosVinculados: [...vinculados],
          }
        : p
    );
    setTemplate({ ...template, passos: novosPassos });
    onClose();
  }

  return (
    <div
      className="modal show fade d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content shadow border-0">
          <div className="modal-header pb-2">
            <h5 className="modal-title">Editar Passo</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body pt-2">
            <div className="mb-2">
              <label className="form-label">Texto do Passo</label>
              <textarea
                className="form-control"
                rows={2}
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                style={{ resize: "vertical" }}
              />
            </div>

            <div className="mb-2">
              <label className="form-label mb-1">Vincular Critérios:</label>
              <div className="d-flex flex-wrap gap-2">
                {template.criterios.map((criterio, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`btn btn-sm px-3 py-1 rounded-pill 
                      ${vinculados.includes(idx) ? "btn-warning" : "btn-outline-secondary"}
                    `}
                    style={{ userSelect: "none" }}
                    onClick={() => toggleCriterio(idx)}
                  >
                    {criterio}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer border-0 pt-1">
            <button className="btn btn-link" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={salvar}>
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
