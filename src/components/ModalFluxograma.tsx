import { useEffect, useRef } from "react";
import mermaid from "mermaid";
import svgPanZoom from "svg-pan-zoom";

type Props = {
  aberto: boolean;
  onClose: () => void;
  diagrama: string;
};

export default function ModalFluxograma({ aberto, onClose, diagrama }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (aberto && ref.current) {
      ref.current.innerHTML = `<div class="mermaid">${diagrama}</div>`;
      mermaid.init(undefined, ref.current.querySelectorAll(".mermaid"));

      // Espera um pouco para o mermaid renderizar o SVG
      setTimeout(() => {
        const svg = ref.current?.querySelector("svg");
        if (svg) {
          svg.removeAttribute("width");
          svg.removeAttribute("height");
          svg.style.width = "100%";
          svg.style.height = "100%";
          // Ativa zoom/pan
          svgPanZoom(svg, {
            zoomEnabled: true,
            controlIconsEnabled: true,
            fit: true,
            center: true,
            minZoom: 0.2,
            maxZoom: 5,
          });
        }
      }, 150);
    }
  }, [aberto, diagrama]);

  if (!aberto) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex={-1}
      style={{ background: "#0009", cursor: "grab" }}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Fluxograma dos Passos</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body" style={{ height: "70vh", padding: 0 }}>
            <div
              ref={ref}
              style={{
                width: "100%",
                height: "100%",
                minHeight: 300,
                overflow: "auto",
                display: "flex",
                alignItems: "stretch",
                justifyContent: "stretch",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
