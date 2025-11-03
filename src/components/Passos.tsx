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
import { useAutoCompleteShortcuts } from '../hooks/useAutoCompleteShortcuts';
import ImportarBlocoModal from "./ImportarBlocoModal";
import ModalFluxograma from "./ModalFluxograma";
import { gerarFluxogramaMermaid } from '../helpers';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGripLines,
  faPen,
  faTrashAlt,
  faListOl,
  faPlus,
  faMinus,
  faToolbox,
} from "@fortawesome/free-solid-svg-icons";

import "./Passos.css";

function SortableItem({
  passo,
  onClick,
  onRemover,
  setPassoSelecionado,
  setModalAberta
}: {
  passo: Passo;
  onClick: () => void;
  onRemover: () => void;
  setPassoSelecionado: (id: string) => void;
  setModalAberta: (aberto: boolean) => void;
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

  const classDiv = passo.isDivisoria ? 'divisoria' : '';

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={"list-group-item d-flex align-items-center justify-content-between gap-2 pl-1 pt-0 pb-0 " + classDiv}
      onDoubleClick={() => {
        if (!passo.isDivisoria) {
          setPassoSelecionado(passo.id);
          setModalAberta(true);
        }
      }}
    >
      {/* Ícone de arrastar */}
      <span style={{ cursor: "grab" }} {...attributes} {...listeners}>
        <FontAwesomeIcon icon={faGripLines} className="text-muted" />
      </span>

      {/* Conteúdo principal */}
      <div className="flex-grow-1 d-flex flex-wrap align-items-center gap-2 pt-1 pb-1">
        <span className="fw-semibold passo-title" title={passo.texto}>
          {passo.texto || "(Sem texto)"}
        </span>

        {[...(passo.criteriosVinculados || [])]
          .filter(idx => template.criterios[idx] !== undefined)
          .sort((a, b) => a - b)
          .map((idx) => (
            <span
              key={idx}
              className="badge rounded-pill bg-warning text-dark small"
              style={{
                fontSize: "0.75rem",
                padding: "0.3em 0.6em",
                maxWidth: 120,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "inline-block",
                verticalAlign: "middle",
              }}
              title={`${idx + 1}. ${
                template.criterios[idx] ?? `Critério ${idx + 1}`
              }`}
            >
              {`${idx + 1}. ${
                template.criterios[idx] ?? `Critério ${idx + 1}`
              }`}
            </span>
          ))}
      </div>

      {/* Ações (à direita) */}
      <div className="d-flex align-items-center gap-2">
        {passo.critico && <span className="badge bg-danger">Crítico</span>}

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
            <FontAwesomeIcon icon={faPen} />
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
          <FontAwesomeIcon icon={faTrashAlt} />
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
  const [modalImportarGrupo, setModalImportarGrupo] = useState(false);
  const [modalFluxoAberto, setModalFluxoAberto] = useState(false);

  const {
    visivel,
    idx,
    shortcutsFiltrados,
    setIdx,
    inserirShortcutSelecionado,
    handleInputChange,
    handleInputKeyDown,
    setVisivel,
    inputRef,
  } = useAutoCompleteShortcuts(novoPasso, setNovoPasso, adicionarPasso);

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
        <FontAwesomeIcon icon={faListOl} className="me-2 text-secondary" />
        Passos de Execução
      </label>

      {/* Checkbox e botão */}
      <div className="d-flex align-items-center gap-3">
        <div className="form-check">
          <input
            style={{ cursor: "pointer" }}
            className="form-check-input"
            type="checkbox"
            id="check-fluxograma"
            checked={!!template.disponibilizarFluxograma}
            onChange={(e) =>
              setTemplate({
                ...template,
                disponibilizarFluxograma: e.target.checked,
              })
            }
          />
          <label
            className="form-check-label"
            htmlFor="check-fluxograma"
            style={{ cursor: "pointer" }}
          >
            Disponibilizar fluxograma
          </label>
        </div>
      </div>

      <ModalFluxograma
        aberto={modalFluxoAberto}
        onClose={() => setModalFluxoAberto(false)}
        diagrama={gerarFluxogramaMermaid(template)}
      />

      {/* Campo de adição de passo */}
      <div className="input-group mb-2 mt-2" style={{ position: "relative" }}>
        <input
          type="text"
          className="form-control"
          ref={inputRef}
          value={novoPasso}
          placeholder="Descreva o passo e pressione Enter"
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onBlur={() => setTimeout(() => setVisivel(false), 200)}
          style={{ zIndex: 2 }} // só pra garantir o focus
        />
        <button
          className="btn btn-outline-primary px-3"
          type="button"
          onClick={() => adicionarPasso()}
          style={{ minWidth: 40 }} // garante largura padrão
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <button
          className="btn btn-outline-secondary px-2"
          type="button"
          title="Importar grupo de passos"
          onClick={() => setModalImportarGrupo(true)}
        >
          <FontAwesomeIcon icon={faToolbox} />
        </button>
        {/* Dropdown de autocomplete ABSOLUTO, ocupando o espaço do input */}
        {visivel && shortcutsFiltrados.length > 0 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "100%",
              width: "calc(100% - 40px)", // tira o espaço do botão
              background: "#fff",
              border: "1px solid #ccc",
              maxHeight: 200,
              overflowY: "auto",
              zIndex: 100,
            }}
          >
            {shortcutsFiltrados.map((s, i) => (
              <div
                key={s.id}
                style={{
                  padding: 8,
                  cursor: "pointer",
                  background: i === idx ? "#e0e0e0" : "#fff",
                  fontWeight: i === idx ? "bold" : "normal",
                }}
                onMouseDown={() => inserirShortcutSelecionado(i)}
                onMouseEnter={() => setIdx(i)}
              >
                ({s.id}) - {s.name}{" "}
                <span className="float-end text-muted">{s.categoria}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botão para divisória */}
      <div className="mb-2">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => adicionarPasso(true)}
        >
          <FontAwesomeIcon icon={faMinus} className="me-1" /> Divisória
        </button>
      </div>

      <ImportarBlocoModal
        aberto={modalImportarGrupo}
        onClose={() => setModalImportarGrupo(false)}
        onImportar={(passos) => {
          const novos = passos.map((p) => ({
            id: crypto.randomUUID(),
            texto: p.texto,
            critico: false,
            criteriosVinculados: [],
            isDivisoria: false,
          }));
          setTemplate({
            ...template,
            passos: [...template.passos, ...novos],
          });
          setModalImportarGrupo(false);
        }}
      />

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
                setPassoSelecionado={setPassoSelecionado}
                setModalAberta={setModalAberta}
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
