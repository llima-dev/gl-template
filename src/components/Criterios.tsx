import { useState } from "react";
import { useTemplateStore } from '../context/TemplateContext';
import { smartReplace } from '../helpers';

export default function Criterios() {
  const { template, setTemplate } = useTemplateStore();
  const [novoCriterio, setNovoCriterio] = useState("");
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [textoEdicao, setTextoEdicao] = useState("");

  function adicionar() {
    const criterio = novoCriterio.trim();
    if (criterio.length > 0) {
      setTemplate({
        ...template,
        criterios: [...template.criterios, criterio],
      });
      setNovoCriterio("");
    }
  }

  function remover(index: number) {
    const novaLista = [...template.criterios];
    novaLista.splice(index, 1);
    setTemplate({ ...template, criterios: novaLista });
  }

  function salvarEdicao(index: number) {
    const novaLista = [...template.criterios];
    novaLista[index] = textoEdicao.trim();
    setTemplate({ ...template, criterios: novaLista });
    setEditandoIndex(null);
    setTextoEdicao("");
  }

  return (
    <div className="mb-4">
      <label className="form-label fw-bold">
        <i className="fas fa-check-circle me-2 text-secondary"></i>
        Critérios de Aceitação
      </label>

      <div className="input-group mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Descreva um critério e pressione Enter"
          value={novoCriterio}
          onChange={(e) => setNovoCriterio(smartReplace(e.target.value))}
          onKeyDown={(e) => e.key === "Enter" && adicionar()}
        />
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={adicionar}
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>

      <ul className="list-group">
        <ul className="list-group">
          {template.criterios.map((criterio, index) => (
            <li
              className="list-group-item d-flex justify-content-between align-items-center"
              key={index}
            >
              <div className="d-flex align-items-center flex-grow-1">
                <span
                  className="me-2 text-secondary fw-bold"
                  style={{ minWidth: 22 }}
                >
                  {index + 1}.
                </span>
                {editandoIndex === index ? (
                  <input
                    type="text"
                    className="form-control me-2"
                    value={textoEdicao}
                    onChange={(e) =>
                      setTextoEdicao(smartReplace(e.target.value))
                    }
                    onBlur={() => salvarEdicao(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") salvarEdicao(index);
                    }}
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => {
                      setEditandoIndex(index);
                      setTextoEdicao(criterio);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {criterio}
                  </span>
                )}
              </div>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => remover(index)}
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </li>
          ))}
        </ul>
      </ul>
    </div>
  );
}
