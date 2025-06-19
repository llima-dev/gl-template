import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTemplateStore } from "../context/TemplateContext";
import type { Passo } from "../types";
import EditarPassoModal from "./EditarPassoModal";

import "./Passos.css";

function SortableItem({
  passo,
  onClick,
  onRemover,
}: {
  passo: Passo;
  onClick: () => void;
  onRemover: () => void;
}) {
  const { template } = useTemplateStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: passo.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="list-group-item d-flex align-items-center justify-content-between gap-3"
    >
      {/* Ícone de arrastar */}
      <span style={{ cursor: "grab" }} {...attributes} {...listeners}>
        <i className="fas fa-grip-lines text-muted"></i>
      </span>

      {/* Conteúdo principal */}
      <div className="flex-grow-1 d-flex flex-wrap align-items-center gap-2">
        <span className="fw-semibold passo-title">{passo.texto || "(Sem texto)"}</span>

        {passo.criteriosVinculados?.map((idx) => (
          <span
            key={idx}
            className="badge rounded-pill bg-warning text-dark small"
            style={{ fontSize: "0.75rem", padding: "0.3em 0.6em" }}
          >
            {template.criterios[idx] ?? `Critério ${idx}`}
          </span>
        ))}
      </div>

      {/* Ações (à direita) */}
      <div className="d-flex align-items-center gap-2">
        {passo.critico && (
          <span className="badge bg-danger">Crítico</span>
        )}

        {!passo.isDivisoria && (
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            title="Editar"
          >
            <i className="fas fa-pen"></i>
          </button>
        )}

        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={(e) => {
            e.stopPropagation();
            onRemover();
          }}
          title="Remover"
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
    </li>
  );
}


export default function Passos() {
  const { template, setTemplate } = useTemplateStore();
  const [modalAberta, setModalAberta] = useState(false);
  const [passoSelecionado, setPassoSelecionado] = useState<string | null>(null);
  const [novoPasso, setNovoPasso] = useState("");

  const sensors = useSensors(useSensor(PointerSensor));

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = template.passos.findIndex((p) => p.id === active.id);
    const newIndex = template.passos.findIndex((p) => p.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const novaLista = arrayMove(template.passos, oldIndex, newIndex);
    setTemplate({ ...template, passos: novaLista });
  }


  function adicionarPasso(isDivisoria: boolean = false) {
    const id = uuid();

    if (isDivisoria) {
      const divisoria: Passo = {
        id,
        texto: "── Divisória ──",
        isDivisoria: true,
      };
      setTemplate({ ...template, passos: [...template.passos, divisoria] });
      return;
    }

    const texto = novoPasso.trim();
    if (!texto) return;

    const novo: Passo = {
      id,
      texto,
      critico: false,
      criteriosVinculados: [],
      isDivisoria: false,
    };
    setTemplate({ ...template, passos: [...template.passos, novo] });
    setNovoPasso("");
  }

  return (
    <div className="mb-4">
      <label className="form-label fw-bold">
        <i className="fas fa-list-ol me-2 text-secondary"></i>
        Passos de Execução
      </label>

      {/* Campo de adição de passo */}
      <div className="input-group mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Descreva o passo e pressione Enter"
          value={novoPasso}
          onChange={(e) => setNovoPasso(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && adicionarPasso()}
        />
        <button
          className="btn btn-outline-primary"
          type="button"
          onClick={() => adicionarPasso()}
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>

      {/* Botão para divisória */}
      <div className="mb-2">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => adicionarPasso(true)}
        >
          <i className="fas fa-minus me-1"></i> Divisória
        </button>
      </div>

      {/* Lista de passos com ordenação */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={template.passos.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="list-group">
            {template.passos.map((passo) => (
              <SortableItem
                key={passo.id}
                passo={passo}
                onClick={() => {
                  setPassoSelecionado(passo.id);
                  setModalAberta(true);
                }}
                onRemover={() => {
                  const novaLista = template.passos.filter(
                    (p) => p.id !== passo.id
                  );
                  setTemplate({ ...template, passos: novaLista });
                }}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      {/* Modal de edição */}
      {modalAberta && passoSelecionado !== null && (
        <EditarPassoModal
          id={passoSelecionado!}
          onClose={() => {
            setPassoSelecionado(null);
            setModalAberta(false);
          }}
        />
      )}
    </div>
  );
}
