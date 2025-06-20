import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useTemplateStore } from "./context/TemplateContext";
import CamposBasicos from "./components/CamposBasicos";
import Criterios from "./components/Criterios";
import Passos from "./components/Passos";
import Impacto from "./components/Impacto";
import AmbienteTestado from "./components/AmbienteTestado";
import Comentario from "./components/Comentario";
import Preparativos from "./components/Preparativos";

export default function App() {
  const { template } = useTemplateStore();

  return (
    <div className="d-flex justify-content-center align-items-start min-vh-100 bg-light">
      <div
        className="mx-auto px-3"
        style={{ maxWidth: "1200px", width: "100%" }}
      >
        <div className="card shadow-sm">
          <div className="card-body">
            <h1 className="h4">
              Gerador de Template GitLab
              {template.nomeTarefa && (
                <span className="ms-2 text-muted" style={{ fontWeight: 400 }}>
                  ({template.nomeTarefa})
                </span>
              )}
            </h1>
            <CamposBasicos />
            <Comentario />
            <hr className="my-4" />
            <Preparativos />
            <hr className="my-4" />
            <Passos />
            <hr className="my-4" />
            <Criterios />
            <hr className="my-4" />
            <Impacto />
            <hr className="my-4" />
            <AmbienteTestado />
          </div>
        </div>
      </div>
    </div>
  );
}
