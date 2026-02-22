export type PreferenciasAlimentares = {
  gosta_de: string[];
  nao_gosta_de: string[];
  restricoes: string[];
  observacoes?: string;
};

export type Rotina = {
  horario_acordar?: string;
  horario_dormir?: string;
  refeicoes_por_dia?: number;
  trabalha_fora?: boolean;
  pratica_atividade_fisica?: boolean;
  descricao_rotina?: string;
};

export type DadosBasicos = {
  nome?: string;
  idade?: number;
  peso_kg?: number;
  altura_cm?: number;
  sexo?: string;
  condicoes_saude: string[];
};

export type Objetivos = {
  objetivo_principal: string;
  objetivos_secundarios: string[];
  prazo_estimado_meses?: number;
};

export type Anamnese = {
  dados_basicos: DadosBasicos;
  rotina: Rotina;
  preferencias: PreferenciasAlimentares;
  objetivos: Objetivos;
  idioma_plano: string;
};

export type ItemRefeicao = {
  nome: string;
  quantidade?: string;
  unidade?: string;
};

export type Refeicao = {
  nome: string;
  horario_sugerido?: string;
  descricao: string;
  observacoes?: string;
  itens?: ItemRefeicao[];
};

export type PlanoAlimentar = {
  resumo_geral: string;
  refeicoes: Refeicao[];
  avisos_importantes: string[];
};

export type PlanoResponse = {
  plano: PlanoAlimentar;
  modelo_utilizado: string;
};

