import type { ExplicacaoGeracao, PlanoAlimentar } from "../types";

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

/**
 * Explicação de exemplo de como a IA pensou ao estruturar o plano genérico.
 * Demonstra o tipo de raciocínio que seria retornado em uma geração real com IA.
 */
export const EXPLICACAO_GENERICA: ExplicacaoGeracao = {
  resumo_raciocinio:
    "Este plano foi estruturado com base em diretrizes gerais de alimentação saudável e equilibrada. " +
    "Optei por 5 refeições ao longo do dia para manter níveis estáveis de energia e evitar períodos longos de jejum. " +
    "A distribuição prioriza alimentos integrais, proteínas magras e vegetais variados, usando medidas caseiras " +
    "para facilitar a compreensão e aplicação prática. O foco está em saciedade, nutrição adequada e sustentabilidade " +
    "a longo prazo, sem restrições extremas.",
  calculos: [
    {
      nome: "IMC de referência",
      valor: "20-25",
      unidade: "kg/m²",
      descricao:
        "Faixa saudável de IMC considerada como referência para este plano genérico. " +
        "Em um plano personalizado, o IMC seria calculado com base no peso e altura informados na anamnese.",
    },
    {
      nome: "TMB estimada",
      valor: "1400-1600",
      unidade: "kcal",
      descricao:
        "Taxa metabólica basal estimada para um adulto médio (varia conforme idade, sexo, peso e altura). " +
        "Em um plano real, seria calculada usando fórmulas como Harris-Benedict ou Mifflin-St Jeor.",
    },
    {
      nome: "Calorias diárias estimadas",
      valor: "1800-2000",
      unidade: "kcal",
      descricao:
        "Necessidade energética total estimada para manutenção de peso em um estilo de vida moderadamente ativo. " +
        "Em um plano personalizado, seria ajustada conforme o objetivo (emagrecimento, ganho de massa ou manutenção).",
    },
    {
      nome: "Distribuição de macronutrientes",
      valor: "50% carboidratos, 25% proteínas, 25% gorduras",
      unidade: "aproximadamente",
      descricao:
        "Proporção geral recomendada para uma alimentação equilibrada. " +
        "Em um plano personalizado, essa distribuição seria ajustada conforme objetivos específicos e preferências.",
    },
  ],
  criterios_escolhidos: [
    "5 refeições ao dia (café da manhã, lanche da manhã, almoço, lanche da tarde e jantar) para manter saciedade e evitar picos de fome.",
    "Horários espaçados de aproximadamente 3-4 horas entre refeições principais, alinhados a uma rotina típica (acordar ~7h, dormir ~22h).",
    "Priorização de alimentos integrais e naturais (pão integral, arroz integral) para maior teor de fibras e nutrientes.",
    "Inclusão de proteína em todas as refeições principais para manter saciedade e suporte à massa muscular.",
    "Uso de medidas caseiras (colheres, xícaras, fatias) em vez de gramas para facilitar a compreensão e aplicação prática.",
    "Distribuição visual do prato no almoço e jantar: metade vegetais, 1/4 proteína e 1/4 carboidrato.",
    "Lanche da tarde mais leve que o almoço, e jantar com porções um pouco menores para não sobrecarregar antes de dormir.",
  ],
  adaptacoes_ao_perfil: [
    "Opções flexíveis em cada refeição (ex.: café com leite ou chá; frango, peixe ou ovo) para permitir variação conforme preferências.",
    "Inclusão de alternativas vegetarianas (leguminosas como feijão) para quem não consome proteína animal.",
    "Foco em alimentos acessíveis e comuns na alimentação brasileira, facilitando a adesão ao plano.",
    "Sugestões de substituições (ex.: castanhas como alternativa ao iogurte no lanche) para variar e evitar monotonia.",
    "Observações práticas sobre horários e porções (ex.: evitar refeições pesadas perto de dormir) para melhor digestão e sono.",
    "Ênfase em educação nutricional através de descrições claras e observações que explicam o 'porquê' de cada escolha.",
  ],
};
