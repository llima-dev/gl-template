import { STORAGE_KEY } from './consts';
import type { Template } from "./types";

export function gerarIdTemplate(): string {
  return "tpl-" + Math.random().toString(36).substr(2, 9) + "-" + Date.now().toString(36);
}

export function limparTexto(texto: string): string {
  return texto.trim().replace(/\s+/g, " ");
}

export function escaparMarkdown(texto: string): string {
  return texto.replace(/_/g, "\\_").replace(/\*/g, "\\*");
}

export function salvarNoStorage(template: Template) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(template));
}