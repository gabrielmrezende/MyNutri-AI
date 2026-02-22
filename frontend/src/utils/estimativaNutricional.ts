import type { ItemRefeicao, PlanoAlimentar, Refeicao } from "../types";

/** kcal e macros por 100g (valores médios para estimativa educativa). */
const TABELA_ESTIMATIVA: Array<{
  palavras: string[];
  kcal: number;
  protein: number;
  carb: number;
  fat: number;
}> = [
  { palavras: ["pão", "integral", "torrada"], kcal: 265, protein: 9, carb: 49, fat: 3 },
  { palavras: ["queijo", "branco", "ricota"], kcal: 260, protein: 18, carb: 3, fat: 20 },
  { palavras: ["geleia"], kcal: 260, protein: 0, carb: 65, fat: 0 },
  { palavras: ["café", "chá", "leite"], kcal: 45, protein: 3, carb: 5, fat: 2 },
  { palavras: ["banana", "maçã", "fruta", "laranja"], kcal: 60, protein: 1, carb: 15, fat: 0 },
  { palavras: ["iogurte", "natural"], kcal: 60, protein: 4, carb: 7, fat: 2 },
  { palavras: ["castanha", "castanhas", "amendoim", "nozes"], kcal: 600, protein: 15, carb: 20, fat: 55 },
  { palavras: ["salada", "legumes", "vegetais", "verdura"], kcal: 25, protein: 2, carb: 4, fat: 0 },
  { palavras: ["frango", "peixe", "peito", "grelhado", "proteína"], kcal: 165, protein: 31, carb: 0, fat: 4 },
  { palavras: ["ovo", "ovos"], kcal: 155, protein: 13, carb: 1, fat: 11 },
  { palavras: ["arroz", "integral"], kcal: 130, protein: 3, carb: 28, fat: 1 },
  { palavras: ["feijão", "leguminosa"], kcal: 130, protein: 9, carb: 24, fat: 0 },
  { palavras: ["batata", "mandioca"], kcal: 90, protein: 2, carb: 21, fat: 0 },
  { palavras: ["massa", "macarrão"], kcal: 130, protein: 5, carb: 25, fat: 1 },
  { palavras: ["peru", "peito de peru"], kcal: 110, protein: 22, carb: 2, fat: 1 },
  { palavras: ["suco", "vitamina", "smoothie"], kcal: 45, protein: 1, carb: 11, fat: 0 },
  { palavras: ["sopa"], kcal: 35, protein: 2, carb: 5, fat: 1 },
];

/** Converte quantidade + unidade em gramas aproximados. */
function gramasAproximados(quantidade: string | undefined, unidade: string | undefined): number {
  const q = Math.max(1, parseFloat(quantidade ?? "1") || 1);
  const u = (unidade ?? "").toLowerCase();
  if (u === "g" || u.endsWith("g")) return q;
  if (u === "ml" || u.endsWith("ml")) return q * 1.02; // líquidos ~densidade 1
  if (u.includes("colher de servir") || u.includes("concha")) return q * 55;
  if (u.includes("colher de sopa")) return q * 15;
  if (u.includes("fatia")) return q * 30;
  if (u.includes("xícara")) return q * 150;
  if (u.includes("unidade") || u.includes("unidade média")) return q * 100;
  if (u.includes("pote") && u.includes("170")) return 170;
  return q * 50; // fallback porção média
}

function buscarNutrientes(nome: string): { kcal: number; protein: number; carb: number; fat: number } {
  const n = nome.toLowerCase();
  for (const row of TABELA_ESTIMATIVA) {
    if (row.palavras.some((p) => n.includes(p))) {
      return { kcal: row.kcal, protein: row.protein, carb: row.carb, fat: row.fat };
    }
  }
  return { kcal: 120, protein: 5, carb: 15, fat: 4 }; // genérico
}

export type TotaisNutricionais = {
  totalKcal: number;
  protein: number;
  carb: number;
  fat: number;
  proteinPct: number;
  carbPct: number;
  fatPct: number;
};

export type CaloriasPorRefeicao = {
  nome: string;
  horario_sugerido?: string;
  kcal: number;
  percentualDoTotal: number;
};

export type ResumoNutricional = {
  totais: TotaisNutricionais;
  porRefeicao: CaloriasPorRefeicao[];
  numRefeicoes: number;
  horarioInicio: string | null;
  horarioFim: string | null;
};

function estimarRefeicao(refeicao: Refeicao): number {
  let kcal = 0;
  if (refeicao.itens && refeicao.itens.length > 0) {
    for (const item of refeicao.itens) {
      const g = gramasAproximados(item.quantidade, item.unidade);
      const nut = buscarNutrientes(item.nome);
      kcal += (g / 100) * nut.kcal;
    }
  } else {
    // Fallback: estimativa por descrição (porção genérica por refeição)
    const porRefeicao: Record<string, number> = {
      "café da manhã": 380,
      "lanche da manhã": 150,
      "almoço": 650,
      "lanche da tarde": 200,
      "jantar": 520,
    };
    const nome = refeicao.nome.toLowerCase();
    for (const [key, val] of Object.entries(porRefeicao)) {
      if (nome.includes(key)) {
        kcal = val;
        break;
      }
    }
    if (kcal === 0) kcal = 400;
  }
  return Math.round(kcal);
}

export function estimarNutricao(plano: PlanoAlimentar): ResumoNutricional {
  const porRefeicao: CaloriasPorRefeicao[] = [];
  let totalKcal = 0;
  let totalProtein = 0;
  let totalCarb = 0;
  let totalFat = 0;

  for (const ref of plano.refeicoes) {
    let kcalRef = 0;
    let proteinRef = 0;
    let carbRef = 0;
    let fatRef = 0;

    if (ref.itens && ref.itens.length > 0) {
      for (const item of ref.itens) {
        const g = gramasAproximados(item.quantidade, item.unidade);
        const nut = buscarNutrientes(item.nome);
        const f = g / 100;
        kcalRef += f * nut.kcal;
        proteinRef += f * nut.protein;
        carbRef += f * nut.carb;
        fatRef += f * nut.fat;
      }
    } else {
      kcalRef = estimarRefeicao(ref);
      proteinRef = (kcalRef * 0.25) / 4;
      carbRef = (kcalRef * 0.5) / 4;
      fatRef = (kcalRef * 0.25) / 9;
    }

    kcalRef = Math.round(kcalRef);
    totalKcal += kcalRef;
    totalProtein += proteinRef;
    totalCarb += carbRef;
    totalFat += fatRef;

    porRefeicao.push({
      nome: ref.nome,
      horario_sugerido: ref.horario_sugerido,
      kcal: kcalRef,
      percentualDoTotal: 0,
    });
  }

  totalProtein = Math.round(totalProtein);
  totalCarb = Math.round(totalCarb);
  totalFat = Math.round(totalFat);

  const kcalFromP = totalProtein * 4;
  const kcalFromC = totalCarb * 4;
  const kcalFromF = totalFat * 9;
  const totalKcalFromMacros = kcalFromP + kcalFromC + kcalFromF;
  const proteinPct = totalKcalFromMacros > 0 ? (kcalFromP / totalKcalFromMacros) * 100 : 33;
  const carbPct = totalKcalFromMacros > 0 ? (kcalFromC / totalKcalFromMacros) * 100 : 44;
  const fatPct = totalKcalFromMacros > 0 ? (kcalFromF / totalKcalFromMacros) * 100 : 23;

  porRefeicao.forEach((r) => {
    r.percentualDoTotal = totalKcal > 0 ? Math.round((r.kcal / totalKcal) * 100) : 0;
  });

  const horarios = plano.refeicoes
    .map((r) => r.horario_sugerido)
    .filter((h): h is string => !!h);

  return {
    totais: {
      totalKcal,
      protein: totalProtein,
      carb: totalCarb,
      fat: totalFat,
      proteinPct: Math.round(proteinPct),
      carbPct: Math.round(carbPct),
      fatPct: Math.round(fatPct),
    },
    porRefeicao,
    numRefeicoes: plano.refeicoes.length,
    horarioInicio: horarios.length > 0 ? horarios[0] : null,
    horarioFim: horarios.length > 0 ? horarios[horarios.length - 1] : null,
  };
}
