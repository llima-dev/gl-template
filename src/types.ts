export type Passo = {
  id: string;
  texto: string;
  critico?: boolean;
  isDivisoria?: boolean;
  criteriosVinculados?: number[];
};

export type BlocoCodigo = {
  titulo?: string;
  linguagem: string;
  codigo: string;
};

export type Preparativo = {
  titulo: string;
  passos: string[];
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
};
