import { useEffect, useState } from "react";

type Passo = { texto: string };

type NovoBlocoModalProps = {
  aberto: boolean;
  onClose: () => void;
  onSalvar: (dados: { titulo: string; passos: Passo[] }) => void;
  blocoEdicao?: { titulo: string; passos: Passo[] };
};

export default function NovoBlocoModal({
  aberto,
  onClose,
  onSalvar,
  blocoEdicao,
}: NovoBlocoModalProps) {
  const [titulo, setTitulo] = useState("");
  const [passos, setPassos] = useState<Passo[]>([{ texto: "" }]);

  useEffect(() => {
    if (blocoEdicao) {
      setTitulo(blocoEdicao.titulo || "");
      setPassos(
        blocoEdicao.passos?.length ? blocoEdicao.passos : [{ texto: "" }]
      );
    } else {
      setTitulo("");
      setPassos([{ texto: "" }]);
    }
  }, [blocoEdicao, aberto]);

  if (!aberto) return null;

  function adicionarPasso() {
    setPassos([...passos, { texto: "" }]);
  }

  function salvar() {
    if (!titulo.trim()) return;
    const filtrados = passos.filter((p) => p.texto.trim());
    onSalvar({ titulo, passos: filtrados });
    onClose();
  }

  return (
    <div className="modal fade show d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5>{blocoEdicao ? "Editar grupo de passos" : "Novo grupo de passos"}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Título do grupo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
            {passos.map((p, i) => (
              <input
                key={i}
                type="text"
                className="form-control mb-2"
                placeholder={`Passo ${i + 1}`}
                value={p.texto}
                onChange={(e) => {
                  const novo = [...passos];
                  novo[i].texto = e.target.value;
                  setPassos(novo);
                }}
              />
            ))}
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={adicionarPasso}
            >
              + Adicionar passo
            </button>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={salvar}>
              {blocoEdicao ? "Salvar alterações" : "Salvar grupo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
