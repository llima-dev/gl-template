import React, { useState } from "react";
import { SHORTCUTS_BLOCOS } from "../helpers";
import { useCustomBlocos } from "../hooks/useCustomBlocos";
import NovoBlocoModal from "./NovoBlocoModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPenToSquare,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import "./ImportarBlocoModal.css";

type Props = {
  aberto: boolean;
  onClose: () => void;
  onImportar: (passos: { texto: string }[]) => void;
};

export default function ImportarBlocoModal({
  aberto,
  onClose,
  onImportar,
}: Props) {
  const { blocos, adicionarBloco, removerBloco, editarBloco } =
    useCustomBlocos();
  const [modalNovoAberta, setModalNovoAberta] = useState(false);
  const [modoEdicao, setModoEdicao] = useState<null | string>(null);
  const [ativo, setAtivo] = useState<string | null>(null);
  const [ativoPadrao, setAtivoPadrao] = useState<number | null>(null);

  function toggleBloco(id: string) {
    setAtivo((prev) => (prev === id ? null : id));
  }

  function togglePadrao(idx: number) {
    setAtivoPadrao((prev) => (prev === idx ? null : idx));
  }

  if (!aberto) return null;

  function handleImportar(passos: { texto: string }[]) {
    onImportar(passos);
    onClose();
  }

  return (
    <>
      {/* Modal principal */}
      <div className="modal fade show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Importar bloco de passos</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              {/* Botão novo grupo */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold m-0">Seus blocos personalizados</h6>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => {
                    setModoEdicao(null);
                    setModalNovoAberta(true);
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} /> Definir novo grupo
                </button>
              </div>

              {/* Blocos personalizados */}
              {blocos.length === 0 && (
                <p className="text-muted">Nenhum bloco personalizado ainda.</p>
              )}

              {blocos.map((b) => {
                const aberto = ativo === b.id;
                return (
                  <div
                    key={b.id}
                    className={`bloco-card ${aberto ? "bloco-ativo" : ""}`}
                  >
                    <div
                      className="bloco-header"
                      onClick={() => toggleBloco(b.id)}
                    >
                      <h6 className="fw-bold m-0">{b.titulo}</h6>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImportar(b.passos);
                          }}
                        >
                          Importar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setModoEdicao(b.id);
                            setModalNovoAberta(true);
                          }}
                          title="Editar"
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            removerBloco(b.id);
                          }}
                          title="Excluir"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>

                    {aberto && (
                      <div className="bloco-body">
                        <ul className="mb-0">
                          {b.passos.map((p, i) => (
                            <li key={i}>{p.texto}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}

              <hr className="my-4" />

              {/* Blocos padrão */}
              <h6 className="fw-bold">Blocos padrão</h6>
              {SHORTCUTS_BLOCOS.map((b, idx) => {
                const aberto = ativoPadrao === idx;
                return (
                  <div
                    key={idx}
                    className={`bloco-card ${aberto ? "bloco-ativo" : ""}`}
                  >
                    <div
                      className="bloco-header"
                      onClick={() => togglePadrao(idx)}
                    >
                      <h6 className="fw-bold m-0">{b.titulo}</h6>
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImportar(b.passos);
                        }}
                      >
                        Importar
                      </button>
                    </div>

                    {aberto && (
                      <div className="bloco-body">
                        <ul className="mb-0">
                          {b.passos.map((p, i) => (
                            <li key={i}>{p.texto}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de criação/edição */}
      {modalNovoAberta && (
        <NovoBlocoModal
          aberto={modalNovoAberta}
          onClose={() => setModalNovoAberta(false)}
          onSalvar={(dados) => {
            if (modoEdicao) editarBloco(modoEdicao, dados);
            else adicionarBloco(dados);
            setModalNovoAberta(false);
          }}
          blocoEdicao={
            modoEdicao ? blocos.find((b) => b.id === modoEdicao) : undefined
          }
        />
      )}
    </>
  );
}
