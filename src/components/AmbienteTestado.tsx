import { useTemplateStore } from "../context/TemplateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faDatabase } from "@fortawesome/free-solid-svg-icons";

export default function AmbienteTestado() {
  const { template, setTemplate } = useTemplateStore();

  const toggleBrowser = (key: keyof typeof template.navegadores) => {
    setTemplate({
      ...template,
      navegadores: {
        ...template.navegadores,
        [key]: !template.navegadores[key],
      },
    });
  };

  const toggleBanco = (key: keyof typeof template.bancos) => {
    setTemplate({
      ...template,
      bancos: {
        ...template.bancos,
        [key]: !template.bancos[key],
      },
    });
  };

  return (
    <div className="mb-4">
      {/* Navegadores */}
      <label className="form-label fw-bold">
        <FontAwesomeIcon icon={faGlobe} className="me-2 text-primary" />
        Navegadores testados:
      </label>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="chrome"
          checked={template.navegadores.chrome}
          onChange={() => toggleBrowser("chrome")}
        />
        <label className="form-check-label" htmlFor="chrome">
          Google Chrome
        </label>
      </div>
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="edge"
          checked={template.navegadores.edge}
          onChange={() => toggleBrowser("edge")}
        />
        <label className="form-check-label" htmlFor="edge">
          Microsoft Edge
        </label>
      </div>

      <hr />

      {/* Bancos de dados */}
      <label className="form-label fw-bold mt-3">
        <FontAwesomeIcon icon={faDatabase} className="me-2 text-dark" />
        Bancos de dados testados:
      </label>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="sqlserver"
          checked={template.bancos.sqlserver}
          onChange={() => toggleBanco("sqlserver")}
        />
        <label className="form-check-label" htmlFor="sqlserver">
          SQL Server (ISO 8859-1)
        </label>
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="oracleIso"
          checked={template.bancos.oracleIso}
          onChange={() => toggleBanco("oracleIso")}
        />
        <label className="form-check-label" htmlFor="oracleIso">
          Oracle (ISO 8859-1)
        </label>
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="postgres"
          checked={template.bancos.postgres}
          onChange={() => toggleBanco("postgres")}
        />
        <label className="form-check-label" htmlFor="postgres">
          PostGreSQL (UTF8)
        </label>
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="oracleUtf"
          checked={template.bancos.oracleUtf}
          onChange={() => toggleBanco("oracleUtf")}
        />
        <label className="form-check-label" htmlFor="oracleUtf">
          Oracle (UTF8)
        </label>
      </div>
    </div>
  );
}
