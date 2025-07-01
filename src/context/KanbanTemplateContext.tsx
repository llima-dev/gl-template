import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { TemplateKanban } from "../types";

const STORAGE_KEY_KANBAN = "template-kanban";

const modeloVazio: TemplateKanban = {
  descricaoProblema: "",
  passos: [],
  resultadoEsperado: "",
  resultadoObtido: "",
  analiseExtra: "",
  implementacao: "",
  detalhamento: "",
};

const KanbanTemplateContext = createContext<{
  kanban: TemplateKanban;
  setKanban: (t: TemplateKanban) => void;
  limpar: () => void;
} | undefined>(undefined);

export function KanbanTemplateProvider({ children }: { children: ReactNode }) {
  const [kanban, setKanban] = useState<TemplateKanban>(() => {
    const raw = localStorage.getItem(STORAGE_KEY_KANBAN);
    return raw ? JSON.parse(raw) : modeloVazio;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_KANBAN, JSON.stringify(kanban));
  }, [kanban]);

  function limpar() {
    localStorage.removeItem(STORAGE_KEY_KANBAN);
    setKanban(modeloVazio);
  }

  return (
    <KanbanTemplateContext.Provider value={{ kanban, setKanban, limpar }}>
      {children}
    </KanbanTemplateContext.Provider>
  );
}

export function useKanbanTemplateStore() {
  const ctx = useContext(KanbanTemplateContext);
  if (!ctx) throw new Error("useKanbanTemplateStore precisa estar dentro do KanbanTemplateProvider");
  return ctx;
}
