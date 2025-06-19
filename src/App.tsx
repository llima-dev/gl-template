import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import CamposBasicos from "./components/CamposBasicos";
import Criterios from "./components/Criterios";
import Passos from "./components/Passos";

export default function App() {
  return (
    <div className="d-flex mt-3 justify-content-center align-items-start min-vh-100 bg-light">
      <div className="mx-auto px-3" style={{ maxWidth: '1200px', width: '100%' }}>
        <div className="card shadow-sm">
          <div className="card-body">
            <h1 className="h4">Gerador de Template GitLab</h1>
            <CamposBasicos />
            <Passos />
            <Criterios />
          </div>
        </div>
      </div>
    </div>
  );
}
