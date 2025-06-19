import { useTemplateStore } from "../context/TemplateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye } from "@fortawesome/free-solid-svg-icons";

export default function Impacto() {
  const { template, setTemplate } = useTemplateStore();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const linhas = e.target.value
      .split("\n")
      .map((linha) => (linha.startsWith("- ") ? linha : `- ${linha}`))
      .join("\n");

    setTemplate({ ...template, impacto: linhas });
  };

  return (
    <div className="mb-4">
      <label className="form-label fw-bold">
        <FontAwesomeIcon icon={faBullseye} className="me-2 text-secondary" />
        Impacto
      </label>
      <textarea
        className="form-control"
        rows={4}
        value={template.impacto}
        onChange={handleChange}
        placeholder="Descreva os impactos esperados, linha por linha..."
        style={{ whiteSpace: "pre-wrap" }}
      />
    </div>
  );
}
