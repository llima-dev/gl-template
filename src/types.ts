export type Passo = {
  id: string;
  texto: string;
  critico?: boolean;
  isDivisoria?: boolean;
  criteriosVinculados?: number[];
};

export type BlocoCodigo = {
  id: string;
  titulo: string;
  linguagem: string;
  codigo: string;
};

export type PassoPreparativo = { id: string; texto: string };

export type Preparativo = {
  id: string;
  titulo: string;
  passos: PassoPreparativo[];
};

export type LinkExterno = {
  titulo: string;
  url: string;
};

export type Template = {
  nomeTarefa: string;
  escopo: string;
  impacto: string;
  criterios: string[];
  passos: Passo[];
  preparativos: Preparativo[];
  blocosDeCodigo: BlocoCodigo[];
  comentariosAtencao: string[];
  linksExternos: LinkExterno[];
  navegadores: {
    chrome: boolean;
    edge: boolean;
  };
  bancos: {
    sqlserver: boolean;
    oracleIso: boolean;
    postgres: boolean;
    oracleUtf: boolean;
  };
  incluirFluxograma: boolean;
  arquivados?: Template[];
  disponibilizarFluxograma?: boolean;
};
