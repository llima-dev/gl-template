import { useState } from "react";
import { SHORTCUTS_BLOCOS } from "../helpers";
import "./ImportarBlocoModal.css";

type Props = {
  aberto: boolean;
  onClose: () => void;
  onImportar: (bloco: typeof SHORTCUTS_BLOCOS[number]) => void;
};

export default function ImportarBlocoModal({ aberto, onClose, onImportar }: Props) {
  const [abertoIdx, setAbertoIdx] = useState<number | null>(null);

  if (!aberto) return null;

  return (
    <>
      {/* Se usar CSS global, coloque só o JSX abaixo */}
      {/* Se quiser estilo só nesse componente, pode colar esse CSS num <style> dentro do componente (prototipando, não recomendado para prod) */}

      <div className="modal fade show d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.25)" }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Importar grupo de passos</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>
            <div className="modal-body">
              {SHORTCUTS_BLOCOS.map((bloco, i) => (
                <div key={i} className={`importar-bloco${abertoIdx === i ? " ativo" : ""}`}>
                  <button
                    className="importar-bloco-header"
                    onClick={() => setAbertoIdx(abertoIdx === i ? null : i)}
                    aria-expanded={abertoIdx === i}
                  >
                    <span>{bloco.titulo}</span>
                    <span className="ms-auto">{abertoIdx === i ? "▲" : "▼"}</span>
                  </button>
                  {abertoIdx === i && (
                    <div className="importar-bloco-body">
                      <ol className="mt-2">
                        {bloco.passos.map((p, j) => (
                          <li key={j}>{p.texto}</li>
                        ))}
                      </ol>
                      <button
                        className="btn btn-sm btn-primary mt-2"
                        onClick={() => onImportar(bloco)}
                      >
                        Importar este grupo
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {SHORTCUTS_BLOCOS.length === 0 && (
                <div className="text-muted text-center py-5">
                  Nenhum grupo de passos cadastrado.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
