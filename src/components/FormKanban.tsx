import { useState } from "react";
import { useKanbanTemplateStore } from "../context/KanbanTemplateContext";
import PassosKanban from "./PassosKanban";
import { 
  gerarTextoKanban,
  smartReplace,
  sweetMessage,
  copiarKanbanRich,
  gerarHtmlKanban
} from "../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCopy,
  faBroom,
  faListCheck,
  faBug
} from "@fortawesome/free-solid-svg-icons";

import "./FormKanban.css";

export default function FormKanban() {
  const [isBug, setIsBug] = useState(false);
  const { kanban, setKanban, limpar } = useKanbanTemplateStore();
  const [copiado, setCopiado] = useState(false);

  function handleCopiar() {
    const texto = gerarTextoKanban(kanban, isBug);
    const html = gerarHtmlKanban(kanban, isBug);

    copiarKanbanRich(html, texto).then(() => {
      setCopiado(true);
      sweetMessage("O texto da tarefa foi copiado!");
      setTimeout(() => setCopiado(false), 1200);
    });
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setKanban({
      ...kanban,
      [e.target.name]: smartReplace(e.target.value),
    });
  }

  return (
    <div>
      <div className="kanban-toolbar">
        <div className="d-flex align-items-center me-3">
          <button
            type="button"
            className={`kanban-toggle ${isBug ? "active" : ""}`}
            title="Alternar tipo de atividade"
            onClick={() => setIsBug((v) => !v)}
          >
            <FontAwesomeIcon icon={isBug ? faBug : faListCheck} />
            <span>{isBug ? " Bug" : " Tarefa"}</span>
          </button>
        </div>
        <button
          className={`btn btn-outline-secondary btn-sm kanban-toolbar-btn${
            copiado ? " btn-success text-white border-success" : ""
          }`}
          type="button"
          onClick={handleCopiar}
          title="Copiar para Kanban"
        >
          <FontAwesomeIcon
            icon={faCopy}
            className={copiado ? "text-white" : ""}
          />
        </button>
        <button
          className="btn btn-outline-danger btn-sm kanban-toolbar-btn"
          type="button"
          onClick={limpar}
          title="Limpar formulário"
        >
          <FontAwesomeIcon icon={faBroom} />
        </button>
      </div>

      <hr />
      <div className="kanban-form-scroll">
        <form className="vstack gap-3 p-3">
          {isBug ? (
            <>
              <div>
                <label className="form-label fw-bold">
                  Descrição do problema
                </label>
                <textarea
                  className="form-control"
                  name="descricaoProblema"
                  value={kanban.descricaoProblema}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
              <div>
                <PassosKanban />
              </div>
              <div>
                <label className="form-label fw-bold">Resultado esperado</label>
                <textarea
                  className="form-control"
                  name="resultadoEsperado"
                  value={kanban.resultadoEsperado}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
              <div>
                <label className="form-label fw-bold">Resultado obtido</label>
                <textarea
                  className="form-control"
                  name="resultadoObtido"
                  value={kanban.resultadoObtido}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
              <div>
                <label className="form-label fw-bold">Análise extra</label>
                <textarea
                  className="form-control"
                  name="analiseExtra"
                  value={kanban.analiseExtra}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="form-label fw-bold">Implementação</label>
                <textarea
                  className="form-control"
                  name="implementacao"
                  value={kanban.implementacao || ""}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
              <div>
                <label className="form-label fw-bold">Detalhamento</label>
                <textarea
                  className="form-control"
                  name="detalhamento"
                  value={kanban.detalhamento || ""}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
