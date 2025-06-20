// src/context/TemplateContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { Template } from "../types";
import { STORAGE_KEY } from "../consts";

const modeloVazio: Template = {
  nomeTarefa: "",
  escopo: "",
  impacto: "",
  criterios: [],
  passos: [],
  preparativos: [],
  blocosDeCodigo: [],
  comentariosAtencao: [],
  linksExternos: [],
  navegadores: { chrome: false, edge: false },
  bancos: {
    sqlserver: false,
    oracleIso: false,
    postgres: false,
    oracleUtf: false,
  },
  incluirFluxograma: false,
  arquivados: [],
};

const TemplateContext = createContext<
  | {
      template: Template;
      setTemplate: (t: Template) => void;
      limpar: () => void;
    }
  | undefined
>(undefined);

export function TemplateProvider({ children }: { children: ReactNode }) {
  const [template, setTemplate] = useState<Template>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : modeloVazio;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(template));
  }, [template]);

  function limpar() {
    localStorage.removeItem(STORAGE_KEY);
    setTemplate(modeloVazio);
  }

  return (
    <TemplateContext.Provider value={{ template, setTemplate, limpar }}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplateStore() {
  const ctx = useContext(TemplateContext);
  if (!ctx) throw new Error("useTemplateStore must be used inside TemplateProvider");
  return ctx;
}
