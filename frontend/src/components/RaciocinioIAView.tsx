import type { ExplicacaoGeracao } from "../types";

type Props = {
  explicacao: ExplicacaoGeracao | null;
  modeloUtilizado?: string;
};

/** Fallback quando não há explicação (ex.: plano de exemplo offline). */
function FallbackSemExplicacao() {
  return (
    <div className="card raciocinio-card raciocinio-card--empty">
      <div className="raciocinio-empty-icon" aria-hidden="true">
        💡
      </div>
      <h2>Como a IA pensou</h2>
      <p>
        Esta visualização mostra o raciocínio e os cálculos que a IA usou para montar seu plano.
        Quando o plano for gerado pelo backend com IA, você verá aqui o resumo do pensamento,
        indicadores calculados (como IMC e TMB) e as adaptações ao seu perfil.
      </p>
      <p className="text-muted">
        Use &quot;Nova anamnese&quot; e gere um plano com o backend ativo para ver a explicação completa.
      </p>
    </div>
  );
}

export function RaciocinioIAView({ explicacao, modeloUtilizado }: Props) {
  if (!explicacao) {
    return <FallbackSemExplicacao />;
  }

  const temResumo = explicacao.resumo_raciocinio?.trim();
  const temCalculos = explicacao.calculos?.length > 0;
  const temCriterios = explicacao.criterios_escolhidos?.length > 0;
  const temAdaptacoes = explicacao.adaptacoes_ao_perfil?.length > 0;

  return (
    <div className="raciocinio-ia">
      <header className="raciocinio-header">
        <h2>Como a IA pensou</h2>
        <p className="raciocinio-subtitle">
          Transparência do processo: cálculos, critérios e adaptações usados para estruturar seu plano.
        </p>
        {modeloUtilizado === "exemplo" && (
          <div className="raciocinio-aviso-exemplo">
            <strong>Plano de exemplo:</strong> Esta explicação demonstra como a IA estruturaria o raciocínio em uma geração real.
            Para ver o raciocínio personalizado com seus dados, inicie o backend e gere um novo plano.
          </div>
        )}
        {modeloUtilizado && modeloUtilizado !== "demonstracao" && modeloUtilizado !== "exemplo" && (
          <span className="raciocinio-modelo" title="Modelo de linguagem utilizado">
            Modelo: {modeloUtilizado}
          </span>
        )}
      </header>

      {temResumo && (
        <section className="card raciocinio-card raciocinio-card--resumo">
          <h3>Resumo do raciocínio</h3>
          <p className="raciocinio-resumo">{explicacao.resumo_raciocinio}</p>
        </section>
      )}

      {temCalculos && (
        <section className="card raciocinio-card raciocinio-card--calculos">
          <h3>Cálculos e estimativas</h3>
          <p className="raciocinio-descricao-secao">
            Indicadores que a IA considerou para dimensionar calorias e metas (quando havia dados suficientes).
          </p>
          <ul className="raciocinio-lista-calculos">
            {explicacao.calculos.map((calc, i) => (
              <li key={i} className="raciocinio-item-calculo">
                <div className="raciocinio-calculo-cabecalho">
                  <span className="raciocinio-calculo-nome">{calc.nome}</span>
                  {(calc.valor != null && calc.valor !== "" && calc.valor !== "—") && (
                    <span className="raciocinio-calculo-valor">
                      {calc.valor}
                      {calc.unidade ? ` ${calc.unidade}` : ""}
                    </span>
                  )}
                </div>
                <p className="raciocinio-calculo-descricao">{calc.descricao}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {temCriterios && (
        <section className="card raciocinio-card raciocinio-card--criterios">
          <h3>Critérios escolhidos</h3>
          <p className="raciocinio-descricao-secao">
            Decisões que guiaram a estrutura do plano (número de refeições, horários, distribuição de nutrientes).
          </p>
          <ul className="raciocinio-lista-bullets">
            {explicacao.criterios_escolhidos.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {temAdaptacoes && (
        <section className="card raciocinio-card raciocinio-card--adaptacoes">
          <h3>Adaptações ao seu perfil</h3>
          <p className="raciocinio-descricao-secao">
            Como suas preferências, restrições e objetivo foram considerados nas sugestões.
          </p>
          <ul className="raciocinio-lista-bullets">
            {explicacao.adaptacoes_ao_perfil.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {!temResumo && !temCalculos && !temCriterios && !temAdaptacoes && (
        <div className="card raciocinio-card raciocinio-card--empty">
          <p className="text-muted">
            Nenhum detalhe de raciocínio foi retornado para esta geração. Tente gerar o plano novamente.
          </p>
        </div>
      )}
    </div>
  );
}
