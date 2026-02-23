import jsPDF from "jspdf";
import type { PlanoAlimentar } from "../types";

const MARGEM_ESQUERDA = 40;
const MARGEM_SUPERIOR = 50;
const MARGEM_INFERIOR = 40;
const ESPACO_LINHA = 14;

export function gerarPdfPlano(plano: PlanoAlimentar) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const larguraUtil = pageWidth - MARGEM_ESQUERDA * 2;

  let y = MARGEM_SUPERIOR;

  const garantirEspaco = (alturaMinima: number) => {
    if (y + alturaMinima > pageHeight - MARGEM_INFERIOR) {
      doc.addPage();
      y = MARGEM_SUPERIOR;
    }
  };

  const adicionarTitulo = (texto: string) => {
    garantirEspaco(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(texto, MARGEM_ESQUERDA, y);
    y += 28;
  };

  const adicionarSubtitulo = (texto: string) => {
    garantirEspaco(24);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(texto, MARGEM_ESQUERDA, y);
    y += 20;
  };

  const adicionarParagrafo = (texto: string, opcoes?: { italico?: boolean; pequeno?: boolean }) => {
    if (!texto.trim()) return;

    const fontStyle = opcoes?.italico ? "italic" : "normal";
    const fontSize = opcoes?.pequeno ? 9 : 11;

    doc.setFont("helvetica", fontStyle as "normal" | "italic" | "bold");
    doc.setFontSize(fontSize);

    const linhas = doc.splitTextToSize(texto, larguraUtil);
    linhas.forEach((linha) => {
      garantirEspaco(ESPACO_LINHA);
      doc.text(linha, MARGEM_ESQUERDA, y);
      y += ESPACO_LINHA;
    });
    y += 4;
  };

  const adicionarLista = (itens: string[]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    itens.forEach((item) => {
      if (!item.trim()) return;
      const linhas = doc.splitTextToSize(item, larguraUtil - 14);
      garantirEspaco(ESPACO_LINHA);
      doc.text(`• ${linhas[0]}`, MARGEM_ESQUERDA, y);
      let localY = y + ESPACO_LINHA;

      for (let i = 1; i < linhas.length; i += 1) {
        garantirEspaco(ESPACO_LINHA);
        doc.text(linhas[i], MARGEM_ESQUERDA + 14, localY);
        localY += ESPACO_LINHA;
      }

      y = localY + 2;
    });
  };

  // Cabeçalho
  adicionarTitulo("Plano alimentar educativo — MyNutri AI");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120);

  const data = new Date();
  const dataFormatada = data.toLocaleString("pt-BR");

  adicionarParagrafo(
    `Conteúdo gerado automaticamente por inteligência artificial (IA) para fins educativos.\nGerado em ${dataFormatada}.`,
    { pequeno: true },
  );

  doc.setTextColor(0);

  // Resumo geral
  adicionarSubtitulo("Resumo geral");
  adicionarParagrafo(plano.resumo_geral);

  // Refeições
  adicionarSubtitulo("Refeições sugeridas");

  plano.refeicoes.forEach((refeicao, index) => {
    const tituloRefeicao = refeicao.horario_sugerido
      ? `${index + 1}. ${refeicao.nome} — ${refeicao.horario_sugerido}`
      : `${index + 1}. ${refeicao.nome}`;

    garantirEspaco(24);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(tituloRefeicao, MARGEM_ESQUERDA, y);
    y += 18;

    if (refeicao.descricao) {
      adicionarParagrafo(refeicao.descricao);
    }

    if (refeicao.itens && refeicao.itens.length > 0) {
      garantirEspaco(20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Itens e porções sugeridas:", MARGEM_ESQUERDA, y);
      y += 16;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      refeicao.itens.forEach((item) => {
        const quantidade = item.quantidade ? ` ${item.quantidade}` : "";
        const unidade = item.unidade ? ` ${item.unidade}` : "";
        const linha = `• ${item.nome}${quantidade}${unidade}`;

        const linhas = doc.splitTextToSize(linha, larguraUtil);
        linhas.forEach((l) => {
          garantirEspaco(ESPACO_LINHA);
          doc.text(l, MARGEM_ESQUERDA, y);
          y += ESPACO_LINHA;
        });
        y += 2;
      });
    }

    if (refeicao.observacoes) {
      adicionarParagrafo(`Observações: ${refeicao.observacoes}`, { italico: true });
    }

    y += 6;
  });

  // Avisos importantes + reforço de IA
  adicionarSubtitulo("Avisos importantes");

  const avisos = [
    ...plano.avisos_importantes,
    "Este conteúdo foi gerado por inteligência artificial (IA) com base nas informações fornecidas por você.",
    "Este material tem caráter exclusivamente educativo e não substitui avaliação, prescrição ou acompanhamento individualizado por nutricionista ou médico.",
  ];

  adicionarLista(avisos);

  doc.save("plano-alimentar-mynutri-ai.pdf");
}

