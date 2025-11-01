import { useState } from "react";
import { v4 as uuid } from "uuid";
import { useTemplateStore } from "../context/TemplateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Passo, BlocoCodigo, Preparativo } from "../types";
import { smartReplace } from '../helpers';
import ImportarBlocoModal from "./ImportarBlocoModal";
import {
  faToolbox,
  faCode,
  faPlus,
  faGripVertical,
  faTrash,
  faChevronDown,
  faChevronRight,
  faEdit,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

// @ts-expect-error erro de lib
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-expect-error erro de lib
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

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

// Linguagens disponíveis
const linguagens = [
  "javascript",
  "typescript",
  "python",
  "java",
  "csharp",
  "php",
  "bash",
  "sql",
  "json",
  "yaml",
];

type BlocoCodigoColapsavelProps = {
  bloco: BlocoCodigo;
  onRemover: (id: string) => void;
};

function BlocoCodigoColapsavel({ bloco, onRemover, onSalvar }: BlocoCodigoColapsavelProps & { onSalvar: (id: string, novoCodigo: string) => void }) {
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState(false);
  const [codigo, setCodigo] = useState(bloco.codigo);

  return (
    <div className="card mb-2">
      <div
        className="card-header d-flex align-items-center justify-content-between"
        style={{ cursor: "pointer", userSelect: "none" }}
        onClick={() => setAberto((v) => !v)}
      >
        <div className="d-flex align-items-center flex-grow-1">
          <FontAwesomeIcon icon={aberto ? faChevronDown : faChevronRight} className="me-2 text-secondary" />
          <strong>{bloco.titulo || <span className="text-muted">Sem título</span>}</strong>
          <span className="badge bg-secondary ms-3">{bloco.linguagem}</span>
        </div>
        {/* Ações */}
        <div className="ms-2 d-flex align-items-center gap-2" onClick={e => e.stopPropagation()}>
          {!editando && (
            <button className="btn btn-sm btn-link text-primary" title="Editar código" onClick={() => setEditando(true)}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
          )}
          {editando && (
            <>
              <button className="btn btn-sm btn-link text-success" title="Salvar edição" onClick={() => { onSalvar(bloco.id, codigo); setEditando(false); }}>
                <FontAwesomeIcon icon={faSave} />
              </button>
              <button className="btn btn-sm btn-link text-danger" title="Cancelar edição" onClick={() => { setCodigo(bloco.codigo); setEditando(false); }}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </>
          )}
          <button className="btn btn-sm btn-link text-danger" title="Remover bloco" onClick={() => onRemover(bloco.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
      {aberto && (
        <div className="card-body p-2" style={{ background: "#181c20", borderRadius: "0 0 8px 8px" }}>
          <div style={{ maxHeight: 320, overflow: "auto" }}>
            {!editando ? (
              <SyntaxHighlighter
                language={bloco.linguagem}
                style={atomOneDark}
                customStyle={{ margin: 0, borderRadius: "8px" }}
              >
                {bloco.codigo}
              </SyntaxHighlighter>
            ) : (
              <textarea
                className="form-control font-monospace"
                style={{ minHeight: 150, background: "#101318", color: "#d8dee9" }}
                value={codigo}
                autoFocus
                onChange={e => setCodigo(e.target.value)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// SortablePasso component
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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
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
            onChange={(e) => setValor(smartReplace(e.target.value))}
            onBlur={salvar}
            onKeyDown={(e) => {
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
            <strong>{index + 1}.</strong>{" "}
            {texto || <i className="text-muted">(sem texto)</i>}
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
  const [modalImportarGrupoPrep, setModalImportarGrupoPrep] = useState<string | null>(null);
  const [prepsAbertos, setPrepsAbertos] = useState<{ [id: string]: boolean }>(
    {}
  );
  const { template, setTemplate } = useTemplateStore();
  const [novosPassos, setNovosPassos] = useState<{ [prepId: string]: string }>(
    {}
  );
  const [editandoTitulo, setEditandoTitulo] = useState<string | null>(null);

  // Bloco de código (modal)
  const [modalAberto, setModalAberto] = useState(false);
  const [tituloBloco, setTituloBloco] = useState("");
  const [linguagem, setLinguagem] = useState("javascript");
  const [codigo, setCodigo] = useState("");

  function salvarCodigoBloco(id: string, novoCodigo: string) {
    const novos = template.blocosDeCodigo.map((b) =>
      b.id === id ? { ...b, codigo: novoCodigo } : b
    );
    setTemplate({ ...template, blocosDeCodigo: novos });
  }

  function abrirModalBloco() {
    setTituloBloco("");
    setLinguagem("javascript");
    setCodigo("");
    setModalAberto(true);
  }

  function togglePrep(id: string) {
    setPrepsAbertos((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function salvarBloco() {
    if (!tituloBloco.trim() && !codigo.trim()) return;
    const novoBloco = {
      id: uuid(),
      titulo: tituloBloco.trim(),
      linguagem,
      codigo,
    };
    setTemplate({
      ...template,
      blocosDeCodigo: [...(template.blocosDeCodigo || []), novoBloco],
    });
    setModalAberto(false);
  }

  function removerBloco(id: string) {
    setTemplate({
      ...template,
      blocosDeCodigo: template.blocosDeCodigo.filter(
        (b: BlocoCodigo) => b.id !== id
      ),
    });
  }

  function adicionarPreparativo() {
    const novo = {
      id: uuid(),
      titulo: "Preparativo " + (template.preparativos.length + 1),
      passos: [],
    };
    setTemplate({
      ...template,
      preparativos: [...template.preparativos, novo],
    });
  }

  function removerPreparativo(id: string) {
    setTemplate({
      ...template,
      preparativos: template.preparativos.filter(
        (p: Preparativo) => p.id !== id
      ),
    });
  }

  function adicionarPasso(prepId: string, texto: string) {
    if (!texto.trim()) return;
    const lista = [...template.preparativos];
    const prep = lista.find((p: Preparativo) => p.id === prepId);
    if (!prep) return;
    prep.passos.push({ id: uuid(), texto: texto.trim() });
    setTemplate({ ...template, preparativos: lista });
  }

  function removerPasso(prepId: string, idx: number) {
    const lista = [...template.preparativos];
    const prep = lista.find((p: Preparativo) => p.id === prepId);
    if (!prep) return;
    prep.passos.splice(idx, 1);
    setTemplate({ ...template, preparativos: lista });
  }

  function atualizarTitulo(prepId: string, novoTitulo: string) {
    const lista = [...template.preparativos];
    const prep = lista.find((p: Preparativo) => p.id === prepId);
    if (!prep) return;
    prep.titulo = novoTitulo.trim() || prep.titulo;
    setTemplate({ ...template, preparativos: lista });
  }

  function atualizarOrdemPassos(prepId: string, novaOrdem: Passo[]) {
    const lista = [...template.preparativos];
    const prep = lista.find((p: Preparativo) => p.id === prepId);
    if (!prep) return;
    prep.passos = novaOrdem;
    setTemplate({ ...template, preparativos: lista });
  }

  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <div className="mb-4">
      <label className="form-label fw-bold">
        <FontAwesomeIcon icon={faToolbox} className="me-2 text-secondary" />
        Preparativos
      </label>

      <div className="d-flex gap-3 mb-3">
        <button
          className="btn btn-sm btn-outline-dark"
          onClick={adicionarPreparativo}
        >
          <FontAwesomeIcon icon={faPlus} className="me-1" />
          Preparativo
        </button>
        <button
          className="btn btn-sm btn-outline-dark"
          onClick={abrirModalBloco}
        >
          <FontAwesomeIcon icon={faCode} className="me-1" />
          Bloco de Código
        </button>
      </div>

      {/* Blocos de Código acima dos preparativos */}
      {template.blocosDeCodigo.map((bloco: BlocoCodigo) => (
        <BlocoCodigoColapsavel
          key={bloco.id}
          bloco={bloco}
          onRemover={removerBloco}
          onSalvar={salvarCodigoBloco}
        />
      ))}

      {/* Modal do bloco de código */}
      {modalAberto && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          role="dialog"
          style={{ background: "rgba(0,0,0,0.25)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Novo Bloco de Código</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalAberto(false)}
                />
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <label className="form-label">Título</label>
                  <input
                    type="text"
                    className="form-control"
                    value={tituloBloco}
                    onChange={(e) => setTituloBloco(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Linguagem</label>
                  <select
                    className="form-select"
                    value={linguagem}
                    onChange={(e) => setLinguagem(e.target.value)}
                  >
                    {linguagens.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label">Código</label>
                  <textarea
                    className="form-control"
                    rows={6}
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalAberto(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={salvarBloco}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {template.preparativos.map((prep: Preparativo) => (
        <div key={prep.id} className="card mb-3 border rounded">
          <div className="card-header bg-light d-flex justify-content-between align-items-center">
            <div
              className="d-flex align-items-center"
              style={{ cursor: "pointer", userSelect: "none" }}
              onClick={() => togglePrep(prep.id)}
            >
              <FontAwesomeIcon
                icon={prepsAbertos[prep.id] ? faChevronDown : faChevronRight}
                className="me-2 text-secondary"
              />
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
                  // Remova o onClick daqui!
                >
                  {prep.titulo}
                </strong>
              )}
            </div>
            <button
              className="btn btn-sm btn-link text-danger"
              onClick={() => removerPreparativo(prep.id)}
            >
              Remover
            </button>
          </div>

          {/* Só renderiza o conteúdo se estiver aberto */}
          {prepsAbertos[prep.id] && (
            <div className="card-body bg-light">
              <div
                className="input-group mb-2"
                style={{ position: "relative" }}
              >
                <input
                  className="form-control form-control-sm"
                  placeholder="Passo"
                  value={novosPassos[prep.id] || ""}
                  onChange={(e) =>
                    setNovosPassos({
                      ...novosPassos,
                      [prep.id]: smartReplace(e.target.value),
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      adicionarPasso(prep.id, novosPassos[prep.id] || "");
                      setNovosPassos({ ...novosPassos, [prep.id]: "" });
                    }
                  }}
                />
                <button
                  className="btn btn-sm btn-outline-success"
                  onClick={() => {
                    adicionarPasso(prep.id, novosPassos[prep.id] || "");
                    setNovosPassos({ ...novosPassos, [prep.id]: "" });
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
                {/* Botão de importar bloco */}
                <button
                  className="btn btn-sm btn-outline-secondary"
                  title="Importar grupo de passos"
                  style={{ minWidth: 36 }}
                  onClick={() => setModalImportarGrupoPrep(prep.id)}
                >
                  <FontAwesomeIcon icon={faToolbox} />
                </button>
              </div>

              {/* Drag and Drop context para passos */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => {
                  const { active, over } = event;
                  if (active && over && active.id !== over.id) {
                    const idx = prep.passos.findIndex(
                      (p: Passo) => p.id === active.id
                    );
                    const idxOver = prep.passos.findIndex(
                      (p: Passo) => p.id === over.id
                    );
                    const novaOrdem = arrayMove(prep.passos, idx, idxOver);
                    atualizarOrdemPassos(prep.id, novaOrdem);
                  }
                }}
              >
                <SortableContext
                  items={prep.passos.map((p: Passo) => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <ul className="list-group">
                    {prep.passos.map((passo: Passo, i: number) => (
                      <SortablePasso
                        key={passo.id}
                        id={passo.id}
                        texto={passo.texto}
                        index={i}
                        onRemover={() => removerPasso(prep.id, i)}
                        onEditar={(novoTexto: string) => {
                          const lista = [...template.preparativos];
                          const p = lista.find(
                            (p: Preparativo) => p.id === prep.id
                          );
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
          )}
        </div>
      ))}

      <ImportarBlocoModal
        aberto={!!modalImportarGrupoPrep}
        onClose={() => setModalImportarGrupoPrep(null)}
        onImportar={(passos) => {
          if (!modalImportarGrupoPrep) return;

          const lista = [...template.preparativos];
          const prep = lista.find((p) => p.id === modalImportarGrupoPrep);
          if (!prep) return;

          const novos = passos.map((p) => ({
            id: uuid(),
            texto: p.texto,
          }));

          prep.passos.push(...novos);
          setTemplate({ ...template, preparativos: lista });
          setModalImportarGrupoPrep(null);
        }}
      />
    </div>
  );
}
