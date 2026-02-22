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
    },
    {
      nome: "Lanche da manhã",
      horario_sugerido: "10:00",
      descricao: "1 porção de fruta ou iogurte natural; ou um punhado de castanhas.",
      observacoes: undefined,
    },
    {
      nome: "Almoço",
      horario_sugerido: "12:30",
      descricao:
        "Prato com metade de vegetais (salada ou legumes), 1/4 de proteína (frango, peixe, ovo ou leguminosas) e 1/4 de carboidrato (arroz, batata ou massa integral).",
      observacoes: "Use medidas caseiras: 1 concha, 1 filé do tamanho da palma da mão.",
    },
    {
      nome: "Lanche da tarde",
      horario_sugerido: "16:00",
      descricao:
        "Iogurte, fruta, sanduíche leve com pão integral ou vitamina de frutas.",
      observacoes: undefined,
    },
    {
      nome: "Jantar",
      horario_sugerido: "19:30",
      descricao:
        "Similar ao almoço, em porções um pouco menores. Sopas e saladas com proteína também são boas opções.",
      observacoes: "Evite refeições pesadas perto do horário de dormir.",
    },
  ],
  avisos_importantes: [
    "Este plano é apenas informativo e de exemplo.",
    "Não substitui acompanhamento por nutricionista ou médico.",
    "Para um plano personalizado, consulte um profissional de saúde ou inicie o backend da aplicação.",
  ],
};
