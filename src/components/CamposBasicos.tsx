import { useTemplateStore } from '../context/TemplateContext';

export default function CamposBasicos() {
  const { template, setTemplate } = useTemplateStore();

  return (
    <div className="mb-4">
      <div className="mb-3">
        <label className="form-label fw-bold">
          <i className="fas fa-tag me-2 text-secondary"></i>
          Nome da Tarefa:
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="Ex: ACT-1234"
          value={template.nomeTarefa}
          onChange={(e) =>
            setTemplate({ ...template, nomeTarefa: e.target.value })
          }
        />
      </div>

      <div>
        <label className="form-label fw-bold">
          <i className="fas fa-circle me-2 text-secondary"></i>
          Escopo:
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="Descreva brevemente o que será testado"
          value={template.escopo}
          onChange={(e) =>
            setTemplate({ ...template, escopo: e.target.value })
          }
        />
      </div>
    </div>
  );
}
