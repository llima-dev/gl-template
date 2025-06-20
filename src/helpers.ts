import { STORAGE_KEY } from './consts';
import type { Template, BlocoCodigo, Preparativo, Passo } from "./types";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

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

export function smartReplace(texto: string): string {
  return texto
    .replace(/->/g, '→')
    .replace(/=>/g, '⇒')
    .replace(/<-/g, '←')
    .replace(/<=/g, '≤')
    .replace(/>=/g, '≥')
    .replace(/!=/g, '≠')
    .replace(/~/g, '≈')
    .replace(/->/g, '→')
    .replace(/<-/g, '←')
    .replace(/(\s)>(\s|$)/g, '$1→$2')
  ;
}

export function escaparUnderscores(texto: string) {
  return texto.replace(/_/g, '\\_');
}

export function substituirShortcodesPorEmojis(texto: string): string {
  const mapa: Record<string, string> = {
    ":star:": "⭐",
    ":rosette:": "🏵️",
    ":notebook:": "📓",
    ":rocket:": "🚀",
    ":bug:": "🐛",
    ":wrench:": "🔧",
    ":clipboard:": "📋",
    ":warning:": "⚠️",
    ":gear:": "⚙️",
    ":mans_shoe:": "👞",
    ":triangular_flag_on_post:": "🚩",
    ":ship:": "🚢",
    ":game_die:": "🎲",
    ":eyeglasses:": "👓",
    ":link:": "🔗",
    ":chart:": "💹",
    ":exclamation:": "❗️"
  };
  
  return texto.replace(/:[^:\s]+:/g, match => mapa[match] || match);
}

function checkmark(cond: boolean) {
  // Mantém o padrão markdown checkbox [X] ou [ ]
  return cond ? "[X]" : "[ ]";
}

export function gerarMarkdown(template: Template): string {
  let md = "";

  // NOME DA TAREFA
  if (template.nomeTarefa) {
    md += `# ${escaparUnderscores(template.nomeTarefa)}\n\n`;
  }

  // ESCOPO
  if (template.escopo) {
    md += `### :star: Escopo \n\n 1. *${escaparUnderscores(
      template.escopo
    )}*\n    \n`;
  }

  // PONTOS DE ATENÇÃO (ajuste conforme seu template)
  if (template.comentariosAtencao && template.comentariosAtencao.length > 0) {
    md += `### :exclamation: Pontos de atenção\n\n`;
    template.comentariosAtencao.forEach((c) => {
      md += `> ${escaparUnderscores(c)}\n`;
    });
    md += `\n____\n`;
  }

  // BLOCOS DE CÓDIGO
  if (template.blocosDeCodigo?.length) {
    md += `### :clipboard: Blocos de Código\n\n`;
    template.blocosDeCodigo.forEach((bloco: BlocoCodigo) => {
      md += `**${bloco.titulo}**\n`;
      md += `\`\`\`${bloco.linguagem}\n${bloco.codigo}\n\`\`\`\n\n`;
    });
  }

  // PREPARATIVOS
  if (template.preparativos?.length) {
    template.preparativos.forEach((prep: Preparativo, idx: number) => {
      md += `### :rosette: Preparativo ${idx + 1} (**${escaparUnderscores(
        prep.titulo
      )}**)\n`;
      prep.passos.forEach((passo, i) => {
        md += `${i + 1}. ${escaparUnderscores(passo.texto)}\n`;
      });
      md += `\n____\n`;
    });
  }

  // PASSOS DE EXECUÇÃO
  if (template.passos?.length) {
    md += `### :mans_shoe: Passos\n\n`;
    let n = 1; // contador real de passos
    template.passos.forEach((passo: Passo) => {
      if (passo.isDivisoria) {
        // Renderize como divisória (ex: --- Etapa 1 ---)
        md += `\n ${escaparUnderscores(passo.texto)} \n\n`;
      } else {
        let linha = `${n}. ${escaparUnderscores(passo.texto)}`;
        if (passo.criteriosVinculados && passo.criteriosVinculados.length > 0) {
          const nums = passo.criteriosVinculados
            .map((idx) => (typeof idx === "number" ? idx + 1 : Number(idx) + 1))
            .sort((a, b) => a - b)
            .join(",");
          linha += ` :warning: (${nums})`;
        }
        md += linha + "\n";
        n++; // só incrementa se não for divisória!
      }
    });
    md += `\n____\n`;
  }

  // CRITÉRIOS
  if (template.criterios?.length) {
    md += `### :warning: Critério de aceitação\n`;
    template.criterios.forEach((crit, i) => {
      md += `${i + 1}. ${escaparUnderscores(crit)}\n`;
    });
    md += `____\n`;
  }

  // IMPACTO (como na sua amostra estava depois dos critérios)
  if (template.impacto) {
    md += `### :triangular_flag_on_post: Impacto\n`;
    md += `${escaparUnderscores(template.impacto)}\n____\n`;
  }

  // NAVEGADORES
  if (template.navegadores) {
    md += `### :ship: Navegadores testados:\n`;
    md += `* ${checkmark(template.navegadores.chrome)} Google Chrome\n`;
    md += `* ${checkmark(template.navegadores.edge)} Microsoft Edge\n`;
    md += `____\n`;
  }

  // BANCOS
  if (template.bancos) {
    md += `### :game_die: Bancos de dados testados:\n`;
    md += `* **ISO 8859-1**:\n`;
    md += `    * ${checkmark(template.bancos.sqlserver)} SQL Server\n`;
    md += `    * ${checkmark(template.bancos.oracleIso)} Oracle\n`;
    md += `* **UTF8**:\n`;
    md += `    * ${checkmark(template.bancos.postgres)} PostGreSQL\n`;
    md += `    * ${checkmark(template.bancos.oracleUtf)} Oracle\n\n`;
  }

  // Remove excesso de \n no fim
  return md.trim();
}

export function copiarParaClipboard(texto: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(texto);
  } else {
    // fallback legacy
    const textarea = document.createElement("textarea");
    textarea.value = texto;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  // SweetAlert2 toast lateral
  Swal.fire({
    toast: true,
    position: "bottom-end",
    icon: "success",
    title: "Markdown copiado!",
    showConfirmButton: false,
    timer: 1300,
    timerProgressBar: true,
    background: "#23272f",
    color: "#fff",
    customClass: {
      popup: 'shadow'
    }
  });
}