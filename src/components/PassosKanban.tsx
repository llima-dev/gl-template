import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useKanbanTemplateStore } from "../context/KanbanTemplateContext";
import type { PassoKanban } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { smartReplace } from "../helpers";
import {
  faGripLines,
  faPen,
  faTrashAlt,
  faListOl,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

function SortableItem({
  passo,
  onEdit,
  onRemove,
}: {
  passo: PassoKanban;
  onEdit: () => void;
  onRemove: () => void;
}) {
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
      <span style={{ cursor: "grab" }} {...attributes} {...listeners}>
        <FontAwesomeIcon icon={faGripLines} className="text-muted" />
      </span>
      <div className="flex-grow-1">
        <span className="fw-semibold">{passo.texto || "(Sem texto)"}</span>
      </div>
      <div className="d-flex align-items-center gap-2">
        {!passo.isDivisoria && (
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={onEdit}
            title="Editar"
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
        )}
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={onRemove}
          title="Remover"
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </div>
    </li>
  );
}

export default function PassosKanban() {
  const { kanban, setKanban } = useKanbanTemplateStore();
  const [modalAberta, setModalAberta] = useState(false);
  const [passoSelecionado, setPassoSelecionado] = useState<string | null>(null);
  const [novoPasso, setNovoPasso] = useState("");

  const sensors = useSensors(useSensor(PointerSensor));

  function onDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = kanban.passos.findIndex((p) => p.id === active.id);
    const newIndex = kanban.passos.findIndex((p) => p.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    setKanban({ ...kanban, passos: arrayMove(kanban.passos, oldIndex, newIndex) });
  }

  function adicionarPasso(isDivisoria = false) {
    const id = uuid();
    if (isDivisoria) {
      setKanban({
        ...kanban,
        passos: [...kanban.passos, { id, texto: "── Divisória ──", isDivisoria: true }],
      });
      return;
    }
    const texto = novoPasso.trim();
    if (!texto) return;
    setKanban({
      ...kanban,
      passos: [...kanban.passos, { id, texto, isDivisoria: false }],
    });
    setNovoPasso("");
  }

  function removerPasso(id: string) {
    setKanban({ ...kanban, passos: kanban.passos.filter((p) => p.id !== id) });
  }

  // Modal de edição simples
  function ModalEditarPasso({ id, onClose }) {
    const passo = kanban.passos.find((p) => p.id === id);
    const [texto, setTexto] = useState(passo?.texto || "");
    if (!passo) return null;

    function salvar() {
      setKanban({
        ...kanban,
        passos: kanban.passos.map((p) =>
          p.id === id ? { ...p, texto: texto.trim() } : p
        ),
      });
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
              <label className="form-label">Texto do Passo</label>
              <textarea
                className="form-control"
                rows={2}
                value={texto}
                onChange={(e) => setTexto(smartReplace(e.target.value))}
              />
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

  return (
    <div className="mb-4">
      <label className="form-label fw-bold">
        <FontAwesomeIcon icon={faListOl} className="me-2 text-secondary" />
        Passos reprodução
      </label>
      <div className="input-group mb-2 mt-2">
        <input
          type="text"
          className="form-control"
          value={novoPasso}
          placeholder="Descreva o passo e pressione Enter"
          onChange={(e) => setNovoPasso(smartReplace(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              adicionarPasso();
            }
          }}
        />
        <button
          className="btn btn-outline-primary px-3"
          type="button"
          onClick={() => adicionarPasso()}
          style={{ minWidth: 40 }}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <div className="mb-2">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => adicionarPasso(true)}
        >
          <FontAwesomeIcon icon={faMinus} className="me-1" /> Divisória
        </button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={kanban.passos.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="list-group">
            {kanban.passos.map((passo) => (
              <SortableItem
                key={passo.id}
                passo={passo}
                onEdit={() => {
                  setPassoSelecionado(passo.id);
                  setModalAberta(true);
                }}
                onRemove={() => removerPasso(passo.id)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      {modalAberta && passoSelecionado && (
        <ModalEditarPasso
          id={passoSelecionado}
          onClose={() => {
            setModalAberta(false);
            setPassoSelecionado(null);
          }}
        />
      )}
    </div>
  );
}
