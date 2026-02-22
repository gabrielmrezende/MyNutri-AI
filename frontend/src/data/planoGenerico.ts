import type { PlanoAlimentar } from "../types";

/**
 * Plano alimentar genérico exibido quando a API não está disponível (uso offline / protótipo).
 */
export const PLANO_ALIMENTAR_GENERICO: PlanoAlimentar = {
  resumo_geral:
    "Este é um plano alimentar de exemplo, com sugestões gerais para o dia a dia. " +
    "Use como inspiração e adapte às suas preferências. Para um plano personalizado com IA, inicie o backend da aplicação.",
  refeicoes: [
    {
      nome: "Café da manhã",
      horario_sugerido: "07:00",
      descricao:
        "1 xícara de café com leite ou chá; 2 fatias de pão integral com queijo branco ou geleia sem açúcar; 1 fruta (ex.: banana ou maçã).",
      observacoes: "Priorize proteína e fibras para manter a saciedade.",
      itens: [
        { nome: "Café com leite ou chá", quantidade: "1", unidade: "xícara" },
        { nome: "Pão integral", quantidade: "2", unidade: "fatia" },
        { nome: "Queijo branco ou geleia sem açúcar", quantidade: "1", unidade: "colher de sopa" },
        { nome: "Banana ou maçã", quantidade: "1", unidade: "unidade média" },
      ],
    },
    {
      nome: "Lanche da manhã",
      horario_sugerido: "10:00",
      descricao: "1 porção de fruta ou iogurte natural; ou um punhado de castanhas.",
      observacoes: undefined,
      itens: [
        { nome: "Iogurte natural", quantidade: "1", unidade: "pote 170g" },
        { nome: "Fruta (ex.: maçã)", quantidade: "1", unidade: "unidade média" },
        { nome: "Castanhas (alternativa)", quantidade: "30", unidade: "g" },
      ],
    },
    {
      nome: "Almoço",
      horario_sugerido: "12:30",
      descricao:
        "Prato com metade de vegetais (salada ou legumes), 1/4 de proteína (frango, peixe, ovo ou leguminosas) e 1/4 de carboidrato (arroz, batata ou massa integral).",
      observacoes: "Use medidas caseiras: 1 concha, 1 filé do tamanho da palma da mão.",
      itens: [
        { nome: "Salada ou legumes (variados)", quantidade: "2", unidade: "colher de servir" },
        { nome: "Frango grelhado ou peixe", quantidade: "100", unidade: "g" },
        { nome: "Arroz integral", quantidade: "3", unidade: "colher de servir" },
        { nome: "Feijão (opcional)", quantidade: "1", unidade: "concha" },
      ],
    },
    {
      nome: "Lanche da tarde",
      horario_sugerido: "16:00",
      descricao:
        "Iogurte, fruta, sanduíche leve com pão integral ou vitamina de frutas.",
      observacoes: undefined,
      itens: [
        { nome: "Pão integral", quantidade: "2", unidade: "fatia" },
        { nome: "Queijo ou peito de peru", quantidade: "30", unidade: "g" },
        { nome: "Suco ou vitamina de frutas", quantidade: "200", unidade: "ml" },
      ],
    },
    {
      nome: "Jantar",
      horario_sugerido: "19:30",
      descricao:
        "Similar ao almoço, em porções um pouco menores. Sopas e saladas com proteína também são boas opções.",
      observacoes: "Evite refeições pesadas perto do horário de dormir.",
      itens: [
        { nome: "Proteína (frango, peixe ou ovo)", quantidade: "80", unidade: "g" },
        { nome: "Vegetais cozidos ou salada", quantidade: "2", unidade: "colher de servir" },
        { nome: "Carboidrato (arroz ou batata)", quantidade: "2", unidade: "colher de servir" },
      ],
    },
  ],
  avisos_importantes: [
    "Este plano é apenas informativo e de exemplo.",
    "Não substitui acompanhamento por nutricionista ou médico.",
    "Para um plano personalizado, consulte um profissional de saúde ou inicie o backend da aplicação.",
  ],
};
