import { useState } from "react";
import { useTemplateStore } from "../context/TemplateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentDots,
  faPen,
  faCheck,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export default function Comentarios() {
  const { template, setTemplate } = useTemplateStore();
  const [novoComentario, setNovoComentario] = useState("");
  const [editando, setEditando] = useState<number | null>(null);
  const [valorEdicao, setValorEdicao] = useState("");

  function adicionar() {
    const texto = novoComentario.trim();
    if (!texto) return;
    setTemplate({
      ...template,
      comentariosAtencao: [...template.comentariosAtencao, texto],
    });
    setNovoComentario("");
  }

  function remover(index: number) {
    const lista = [...template.comentariosAtencao];
    lista.splice(index, 1);
    setTemplate({ ...template, comentariosAtencao: lista });
  }

  function salvarEdicao(index: number) {
    const texto = valorEdicao.trim();
    if (!texto) return;
    const lista = [...template.comentariosAtencao];
    lista[index] = texto;
    setTemplate({ ...template, comentariosAtencao: lista });
    setEditando(null);
    setValorEdicao("");
  }

  return (
    <div className="mb-4">
      <label className="form-label fw-bold">
        <FontAwesomeIcon icon={faCommentDots} className="me-2 text-secondary" />
        Comentário
      </label>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Digite um comentário e pressione Enter"
          value={novoComentario}
          onChange={(e) => setNovoComentario(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && adicionar()}
        />
        <button className="btn btn-outline-primary" onClick={adicionar}>
          <FontAwesomeIcon icon={faCheck} />
        </button>
      </div>

      <div className="d-flex flex-column gap-2">
        {template.comentariosAtencao.map((coment, idx) => (
          <div
            key={idx}
            className="border-start ps-3 bg-light rounded position-relative py-2"
            style={{ borderLeft: "4px solid #0d6efd" }}
          >
            {editando === idx ? (
              <div className="d-flex gap-2 align-items-start">
                <input
                  className="form-control"
                  value={valorEdicao}
                  onChange={(e) => setValorEdicao(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && salvarEdicao(idx)}
                />
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => salvarEdicao(idx)}
                  title="Salvar"
                >
                  <FontAwesomeIcon icon={faCheck} />
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => {
                    setEditando(null);
                    setValorEdicao("");
                  }}
                  title="Cancelar"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ) : (
              <div className="d-flex justify-content-between align-items-start">
                <div className="text-muted" style={{ whiteSpace: "pre-line" }}>
                  {coment}
                </div>
                <div className="btn-group btn-group-sm">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => {
                      setEditando(idx);
                      setValorEdicao(coment);
                    }}
                    title="Editar"
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => remover(idx)}
                    title="Remover"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
