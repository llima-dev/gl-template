import { useState } from "react";
import { v4 as uuid } from "uuid";
import { useTemplateStore } from "../context/TemplateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Passo } from "../types";
import {
  faToolbox,
  faCode,
  faLink,
  faPlus,
  faGripVertical,
} from "@fortawesome/free-solid-svg-icons";

// Drag and Drop imports
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type SortablePassoProps = {
  id: string;
  texto: string;
  index: number;
  onRemover: () => void;
  onEditar: (novoTexto: string) => void;
};

function SortablePasso({
  id,
  texto,
  index,
  onRemover,
  onEditar,
}: SortablePassoProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const [editando, setEditando] = useState(false);
  const [valor, setValor] = useState(texto);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    background: "#fff",
  };

  function salvar() {
    if (valor.trim() && valor !== texto) {
      onEditar(valor.trim());
    }
    setEditando(false);
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="list-group-item d-flex justify-content-between align-items-center"
      {...attributes}
    >
      {/* Drag handle */}
      <span style={{ cursor: "grab" }} {...listeners}>
        <FontAwesomeIcon icon={faGripVertical} className="me-2 text-muted" />
      </span>

      {/* Conteúdo editável */}
      <div className="flex-grow-1">
        {editando ? (
          <input
            type="text"
            className="form-control form-control-sm"
            value={valor}
            onChange={e => setValor(e.target.value)}
            onBlur={salvar}
            onKeyDown={e => {
              if (e.key === "Enter") salvar();
              if (e.key === "Escape") setEditando(false);
            }}
            autoFocus
            style={{ minWidth: "120px" }}
          />
        ) : (
          <span
            className="fw-semibold passo-title"
            style={{ cursor: "pointer" }}
            onClick={() => setEditando(true)}
            title="Clique para editar"
          >
            <strong>{index + 1}.</strong> {texto || <i className="text-muted">(sem texto)</i>}
          </span>
        )}
      </div>

      <button
        className="btn btn-sm btn-outline-danger"
        onClick={onRemover}
        tabIndex={-1}
      >
        Remover
      </button>
    </li>
  );
}

export default function Preparativos() {
  const { template, setTemplate } = useTemplateStore();
  const [novoPasso, setNovoPasso] = useState("");
  const [editandoTitulo, setEditandoTitulo] = useState<string | null>(null);

  function adicionarPreparativo() {
    const novo = {
      id: uuid(),
      titulo: "Preparativo " + (template.preparativos.length + 1),
      passos: [], // Agora passos é array de objetos {id, texto}
    };
    setTemplate({
      ...template,
      preparativos: [...template.preparativos, novo],
    });
  }

  function removerPreparativo(id: string) {
    setTemplate({
      ...template,
      preparativos: template.preparativos.filter((p) => p.id !== id),
    });
  }

  function adicionarPasso(prepId: string, texto: string) {
    if (!texto.trim()) return;
    const lista = [...template.preparativos];
    const prep = lista.find((p) => p.id === prepId);
    if (!prep) return;
    prep.passos.push({ id: uuid(), texto: texto.trim() }); // novo formato
    setTemplate({ ...template, preparativos: lista });
  }

  function removerPasso(prepId: string, idx: number) {
    const lista = [...template.preparativos];
    const prep = lista.find((p) => p.id === prepId);
    if (!prep) return;
    prep.passos.splice(idx, 1);
    setTemplate({ ...template, preparativos: lista });
  }

  function atualizarTitulo(prepId: string, novoTitulo: string) {
    const lista = [...template.preparativos];
    const prep = lista.find((p) => p.id === prepId);
    if (!prep) return;
    prep.titulo = novoTitulo.trim() || prep.titulo;
    setTemplate({ ...template, preparativos: lista });
  }

  function atualizarOrdemPassos(prepId: string, novaOrdem: Passo[]) {
    const lista = [...template.preparativos];
    const prep = lista.find((p) => p.id === prepId);
    if (!prep) return;
    prep.passos = novaOrdem;
    setTemplate({ ...template, preparativos: lista });
  }


  // Para cada preparativo, sensores próprios (poderia ser global também)
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <div className="mb-4">
      <label className="form-label fw-bold">
        <FontAwesomeIcon icon={faToolbox} className="me-2 text-secondary" />
        Preparativos
      </label>

      <div className="d-flex gap-3 mb-3">
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={adicionarPreparativo}
        >
          <FontAwesomeIcon icon={faPlus} className="me-1" />
          Preparativo
        </button>
        <button className="btn btn-sm btn-outline-dark" disabled>
          <FontAwesomeIcon icon={faCode} className="me-1" />
          Bloco de Código
        </button>
        <button className="btn btn-sm btn-outline-secondary" disabled>
          <FontAwesomeIcon icon={faLink} className="me-1" />
          Link auxiliar
        </button>
      </div>

      {template.preparativos.map((prep) => (
        <div key={prep.id} className="card mb-3 border rounded">
          <div className="card-header bg-light d-flex justify-content-between align-items-center">
            {editandoTitulo === prep.id ? (
              <input
                type="text"
                className="form-control form-control-sm"
                defaultValue={prep.titulo}
                onBlur={(e) => {
                  atualizarTitulo(prep.id, e.target.value);
                  setEditandoTitulo(null);
                }}
                autoFocus
              />
            ) : (
              <strong
                className="text-dark"
                onClick={() => setEditandoTitulo(prep.id)}
                style={{ cursor: "pointer" }}
              >
                {prep.titulo}
              </strong>
            )}
            <button
              className="btn btn-sm btn-link text-danger"
              onClick={() => removerPreparativo(prep.id)}
            >
              Remover
            </button>
          </div>

          <div className="card-body bg-light">
            <div className="input-group mb-2">
              <input
                className="form-control form-control-sm"
                placeholder="Novo passo"
                value={novoPasso}
                onChange={(e) => setNovoPasso(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    adicionarPasso(prep.id, novoPasso);
                    setNovoPasso("");
                  }
                }}
              />
              <button
                className="btn btn-sm btn-outline-success"
                onClick={() => {
                  adicionarPasso(prep.id, novoPasso);
                  setNovoPasso("");
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            {/* Drag and Drop context para passos */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => {
                const { active, over } = event;
                if (active && over && active.id !== over.id) {
                  const idx = prep.passos.findIndex((p) => p.id === active.id);
                  const idxOver = prep.passos.findIndex(
                    (p) => p.id === over.id
                  );
                  const novaOrdem = arrayMove(prep.passos, idx, idxOver);
                  atualizarOrdemPassos(prep.id, novaOrdem);
                }
              }}
            >
              <SortableContext
                items={prep.passos.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <ul className="list-group">
                  {prep.passos.map((passo, i) => (
                    <SortablePasso
                      key={passo.id}
                      id={passo.id}
                      texto={passo.texto}
                      index={i}
                      onRemover={() => removerPasso(prep.id, i)}
                      onEditar={(novoTexto: string) => {
                        const lista = [...template.preparativos];
                        const p = lista.find((p) => p.id === prep.id);
                        if (!p) return;
                        p.passos[i].texto = novoTexto;
                        setTemplate({ ...template, preparativos: lista });
                      }}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      ))}
    </div>
  );
}
