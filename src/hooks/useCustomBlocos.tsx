import { useState, useEffect } from "react";

const STORAGE_KEY = "blocos_personalizados";

export type BlocoPersonalizado = {
  id: string;
  titulo: string;
  passos: { texto: string }[];
};

export function useCustomBlocos() {
  const [blocos, setBlocos] = useState<BlocoPersonalizado[]>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  function carregar() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) setBlocos(JSON.parse(data));
  }

  useEffect(() => {
    carregar();
    const listener = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) carregar();
    };
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blocos));
  }, [blocos]);

  function adicionarBloco(bloco: Omit<BlocoPersonalizado, "id">) {
    const novo = { ...bloco, id: crypto.randomUUID() };
    setBlocos((prev) => [...prev, novo]);
  }

  function removerBloco(id: string) {
    setBlocos((prev) => prev.filter((b) => b.id !== id));
  }

  function editarBloco(id: string, dados: Partial<BlocoPersonalizado>) {
    setBlocos((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...dados } : b))
    );
  }

  return { blocos, adicionarBloco, removerBloco, editarBloco, recarregar: carregar };
}
