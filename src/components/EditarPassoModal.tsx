import React, { useState, useEffect } from "react";
import { useTemplateStore } from '../context/TemplateContext';

type Props = {
  id: string;
  onClose: () => void;
};

export default function EditarPassoModal({ id, onClose }: Props) {
  const { template, setTemplate } = useTemplateStore();

  // 🔁 Busca o passo, mas pode ser undefined inicialmente
  const passo = template.passos.find((p) => p.id === id);

  // 🔐 Inicializa os states com valores padrão
  const [texto, setTexto] = useState("");
  const [critico, setCritico] = useState(false);
  const [vinculados, setVinculados] = useState<number[]>([]);

  // 🧠 Atualiza quando o passo existir
  useEffect(() => {
    if (passo) {
      setTexto(passo.texto);
      setCritico(passo.critico ?? false);
      setVinculados(passo.criteriosVinculados ?? []);
    }
  }, [passo]);

  // ⛔️ Se não encontrou, não renderiza
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
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">Editar Passo</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {/* Campo de texto */}
            <div className="mb-3">
              <label className="form-label">Texto do Passo</label>
              <textarea
                className="form-control"
                rows={3}
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
            </div>

            {/* Check de crítico */}
            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="criticoCheck"
                checked={critico}
                onChange={(e) => setCritico(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="criticoCheck">
                Marcar como crítico
              </label>
            </div>

            {/* Lista de critérios */}
            <div className="mb-2">
              <label className="form-label">Vincular Critérios:</label>
              <div className="row">
                {template.criterios.map((criterio, idx) => (
                  <div className="col-md-6" key={idx}>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`criterio-${idx}`}
                        checked={vinculados.includes(idx)}
                        onChange={() => toggleCriterio(idx)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`criterio-${idx}`}
                      >
                        {criterio}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={salvar}>
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
