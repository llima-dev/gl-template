import { useState, useRef } from "react";
import { SUGEST_AUTO_COMPLETE } from "../helpers";
import { smartReplace } from "../helpers";

export function useAutoCompleteShortcuts(novoPasso: string, setNovoPasso: (v: string) => void, onAddFunc: () => void) {
  const [visivel, setVisivel] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [idx, setIdx] = useState(0);
  const [posAbertura, setPosAbertura] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const shortcutsFiltrados = SUGEST_AUTO_COMPLETE.filter(
    s =>
      s.name.toLowerCase().includes(filtro.toLowerCase()) ||
      s.id.toLowerCase().includes(filtro.toLowerCase())
  );

  function handleInputChange(valor: string) {
    const valorTratado = smartReplace(valor);
    setNovoPasso(valorTratado);

    if (valor.endsWith("(")) {
      setVisivel(true);
      setFiltro("");
      setIdx(0);
      setPosAbertura(valor.length - 1);
    } else if (visivel) {
      const idxPar = valor.lastIndexOf("(");
      if (idxPar >= 0) {
        setFiltro(valor.slice(idxPar + 1));
        setPosAbertura(idxPar);
      } else {
        setVisivel(false);
      }
    }
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (visivel && shortcutsFiltrados.length > 0) {
      // Autocomplete aberto: navegação e seleção
      if (e.key === "Enter") {
        inserirShortcutSelecionado(idx);
        e.preventDefault();
        return;
      }
      if (e.key === "ArrowDown") {
        setIdx((prev) => Math.min(prev + 1, shortcutsFiltrados.length - 1));
        e.preventDefault();
        return;
      }
      if (e.key === "ArrowUp") {
        setIdx((prev) => Math.max(prev - 1, 0));
        e.preventDefault();
        return;
      }
      if (e.key === "Escape") {
        setVisivel(false);
        e.preventDefault();
        return;
      }
    } else if (e.key === "Enter") {
      // Autocomplete fechado: Enter adiciona o passo normalmente!
      onAddFunc();
      e.preventDefault();
    }
  }

  function inserirShortcutSelecionado(idxEscolhido = idx) {
    const escolha = shortcutsFiltrados[idxEscolhido];
    if (!escolha || posAbertura === null) return;
    const textoAntes = novoPasso.slice(0, posAbertura);
    const novoTexto = smartReplace(`${textoAntes}(${escolha.id}) - ${escolha.name} `);
    setNovoPasso(novoTexto);
    setVisivel(false);
  }

  return {
    visivel,
    idx,
    shortcutsFiltrados,
    setIdx,
    inserirShortcutSelecionado,
    handleInputChange,
    handleInputKeyDown,
    setVisivel,
    inputRef,
  };
}
