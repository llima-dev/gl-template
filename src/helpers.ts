import { STORAGE_KEY } from './consts';
import type { Template, BlocoCodigo, Preparativo, Passo, TemplateKanban } from "./types";
import Swal from "sweetalert2";
import pako from "pako";

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
  if (typeof texto !== "string") return "";
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

function gerarKrokiUrl(mermaid: string) {
  // Compacta e converte para base64 url-safe, conforme Kroki recomenda
  const deflated = pako.deflate(mermaid, { level: 9 });
  const b64 = btoa(String.fromCharCode(...new Uint8Array(deflated)))
    .replace(/\+/g, '-').replace(/\//g, '_');
  return `https://kroki.io/mermaid/svg/${b64}`;
}

function negritarParenteses(texto: string): string {
  return texto.replace(/\(([^)]+)\)/g, '(**$1**)');
}

export function gerarMarkdown(template: Template, isPreview: boolean = false): string {
  let md = "";

  // NOME DA TAREFA
  if (template.nomeTarefa) {
    md += `# ${escaparUnderscores(template.nomeTarefa)}\n\n`;
    if (isPreview) md += "\n____\n";
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
    template.preparativos.forEach((prep: Preparativo, i) => {
      const tituloFormatado = prep.titulo.startsWith("Preparativo")
        ? escaparUnderscores(prep.titulo)
        : `Preparativo ${i + 1}: ${escaparUnderscores(prep.titulo)}`;

      md += `### :rosette: ${tituloFormatado}\n`;
      prep.passos.forEach((passo, j) => {
        md += `${j + 1}. ${negritarParenteses(
          escaparUnderscores(passo.texto)
        )}\n`;
      });
      md += `\n____\n`;
    });
  }

  // PASSOS DE EXECUÇÃO
  if (template.passos?.length) {
    md += `### :mans_shoe: Passos\n\n`;
    let n = 1; // contador real de passos
    let etapaContador = 1; // contador de etapas/divisórias

    template.passos.forEach((passo: Passo) => {
      if (passo.isDivisoria) {
        // Substitui pelo formato --- 1ª Etapa ---
        const sufixo = "ª";
        md += `\n--- ${etapaContador}${sufixo} Etapa ---\n\n`;
        etapaContador++;
      } else {
        let linha = `${n}. ${negritarParenteses(
          escaparUnderscores(passo.texto)
        )}`;
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

    const diagramaMermaid = gerarFluxogramaMermaid(template);

    if (
      diagramaMermaid &&
      template.nomeTarefa &&
      template.disponibilizarFluxograma
    ) {
      const krokiUrl = gerarKrokiUrl(diagramaMermaid);
      md += `\n> [Visualizar fluxograma do teste](${krokiUrl})\n\n`;
    }
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

  // CHECKLIST FIXO
  md += `### :warning: Checklist de itens indispensáveis
  * [ ] Revisão do plano de teste (PO)
  * [ ] Revisão do plano de teste (QA)
  * [ ] Code review do Tech Lead
  ____
  `;

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

  sweetMessage('Markdown copiado!');
}

export function sweetMessage(message: string) {
    Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: message,
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

export function exportarParaJSON(obj: any, nome: string = "template") {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", nome + ".json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

export function importarDeJSON(event: React.ChangeEvent<HTMLInputElement>, onLoad: (data: any) => void) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target?.result as string);
      onLoad(json);
    } catch {
      sweetMessage("Arquivo inválido!");
    }
  };
  reader.readAsText(file);
}

export const SUGEST_AUTO_COMPLETE = [
  // Geral
  { id: "PL001", name: "Ações e planos", categoria: "Geral" },
  { id: "PL020", name: "Categoria", categoria: "Geral" },

  // Cadastro
  { id: "PL002", name: "Modelo", categoria: "Cadastro" },
  { id: "PL021", name: "Parâmetros gerais", categoria: "Cadastro" },
  { id: "PM063", name: "Processo", categoria: "Processos" },

  // Consulta
  { id: "PL026", name: "Tarefas", categoria: "Consulta" },
  { id: "PL027", name: "Histórico de ações", categoria: "Consulta" },
  { id: "SR008", name: "Solicitação", categoria: "Consulta" },
  { id: "SR019", name: "Tarefas", categoria: "Consulta" },

  // Execução
  { id: "PL009", name: "Execução de ação", categoria: "Execução" },
  { id: "PL010", name: "Acompanhamento de processo", categoria: "Execução" },
  { id: "SR005", name: "Acompanhamento de solicitação", categoria: "Execução" },
  { id: "SR004", name: "Aprovação de solicitação", categoria: "Execução" },
  { id: "SR007", name: "Eliminação de solicitação", categoria: "Execução" },
  { id: "SR003", name: "Emissão de solicitação", categoria: "Execução" },
  { id: "SR006", name: "Encerramento de solicitação", categoria: "Execução" },
];

// Dados em uma constante
export const SHORTCUTS_BLOCOS = [
  {
    titulo: "Cadastrar plano com categoria simples",
    passos: [
      { texto: "Acessar → Categoria (PL020)" },
      { texto: "Acessar Ações e planos (PL001) → Criar um registro" },
      { texto: "No Gantt, inserir algumas ações" }
    ]
  },
  {
    titulo: "Configurar processo com integração ao plano de ação",
    passos: [
      { texto: "Acessar Processo (PM063) → Criar um processo" },
      { texto: "Em automação → Componente: Workflow, Objeto: Problema" },
      { texto: "Salvar e sair" },
      { texto: "Criar um Inicio, uma atividade e um finalizador" },
      { texto: "Nos dados da atividade → Configuração → Execução" },
      { texto: "Marcar a flag 'Plano e ação isolada'" },
      { texto: "Salvar e sair, e homologar o processo" }
    ]
  },
    {
    titulo: "Emissão de solicitação",
    passos: [
      { texto: "Acessar → Tipo de solicitação (SR016) → Criar um tipo" },
      { texto: "Em componente: [preencher_componente] e Operação: [preencher_operacao]" },
      { texto: "Acessar Emissão de solicitação (SR003) e emitir uma solicitação com o tipo criado" }
    ]
  },
];

export function gerarFluxogramaMermaid(template: Template) {
  let diagrama = 'flowchart LR\n';
  diagrama += `A[Tarefa: ${template.nomeTarefa || 'Sem nome'}]:::etapa\n`;
  diagrama += `A --> PX[Passos de Teste]:::etapa\n`;

  let passoNumero = 1;
  let prev = 'PX';
  let etapaContador = 1;

  template.passos.forEach((p: Passo, idx: number) => {
    if (!p.texto || typeof p.texto !== "string") return;

    const textoLimpo = p.texto.trim();

    if (p.isDivisoria) {
      // Numera a etapa conforme a ordem das divisórias
      const eid = `E${etapaContador}`;

      const sufixo = etapaContador === 1 ? "ª" : "ª";
      const nomeEtapa = `${etapaContador}${sufixo} Etapa`;
      diagrama += `${prev} --> ${eid}["${nomeEtapa}"]:::etapa\n`;
      prev = eid;
      etapaContador++;
      return;
    }

    const id = `S${idx}`;
    const texto = `${passoNumero++} - ${textoLimpo}`; // pode sanitizar se quiser
    const critico = Array.isArray(p.criteriosVinculados) && p.criteriosVinculados.length > 1;
    const classe = critico ? 'critico' : 'passo';

    diagrama += `${prev} --> ${id}["${texto}"]:::${classe}\n`;
    prev = id;

    if (Array.isArray(p.criteriosVinculados)) {
      p.criteriosVinculados.forEach((criterioIdx: number, j: number) => {
        const cid = `C_${idx}_${j}`;
        const textoCrit = template.criterios[criterioIdx] || `Critério ${criterioIdx + 1}`;
        diagrama += `${id} -- critério --> ${cid}["${textoCrit}"]:::criterio\n`;
      });
    }
  });

  diagrama += `
    classDef etapa fill:#fff3cd,stroke:#856404,stroke-width:2px,color:#000;
    classDef passo fill:#b2ebf2,stroke:#00796b,color:#000;
    classDef critico fill:#ef9a9a,stroke:#b71c1c,stroke-width:2px,color:#000;
    classDef criterio fill:#e1bee7,stroke:#663399,color:#000;
  `;
  return diagrama;
}

export function gerarTextoKanban(kanban: TemplateKanban, isBug: boolean): string {
  let passoNum = 1;
  let etapaNum = 1;
  const lista = (kanban.passos || [])
    .map(p => p.isDivisoria
      ? `- ${etapaNum++}ª Etapa ---`
      : `${passoNum++}. ${p.texto}`
    )
    .join('\n');

  if (isBug) {
    return [
      "🟦 DESCRIÇÃO DO PROBLEMA",
      kanban.descricaoProblema || "-",
      "",
      "🟧 COMO REPRODUZIR (PASSO A PASSO)",
      lista || "-",
      "",
      "🟩 RESULTADO ESPERADO",
      kanban.resultadoEsperado || "-",
      "",
      "🟥 RESULTADO OBTIDO",
      kanban.resultadoObtido || "-",
      "",
      "🟪 ANÁLISE EXTRA",
      kanban.analiseExtra || "-",
    ].join('\n');
  } else {
    return [
      "🟦 IMPLEMENTAÇÃO",
      kanban.implementacao || "-",
      "",
      "🟪 DETALHAMENTO",
      kanban.detalhamento || "-",
    ].join('\n');
  }
}
