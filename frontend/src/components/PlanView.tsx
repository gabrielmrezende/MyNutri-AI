import type { PlanoAlimentar } from "../types";

type Props = {
  plano: PlanoAlimentar | null;
  loading: boolean;
  error: string | null;
};

export function PlanView({ plano, loading, error }: Props) {
  if (loading) {
    return (
      <div className="card loading-message">
        Gerando seu plano alimentar educativo, por favor aguarde...
      </div>
    );
  }

  if (error) {
    return <div className="card error">{error}</div>;
  }

  if (!plano) {
    return (
      <div className="card muted">
        Preencha a anamnese ao lado para gerar um plano alimentar educativo personalizado.
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Seu plano alimentar educativo</h2>
      <p>{plano.resumo_geral}</p>

      <h3>Refeições sugeridas</h3>
      <div className="refeicoes-grid">
        {plano.refeicoes.map((refeicao) => (
          <article key={refeicao.nome + refeicao.horario_sugerido} className="refeicao-card">
            <header className="refeicao-header">
              <strong>{refeicao.nome}</strong>
              {refeicao.horario_sugerido && (
                <span className="refeicao-horario">{refeicao.horario_sugerido}</span>
              )}
            </header>
            <p>{refeicao.descricao}</p>
            {refeicao.observacoes && (
              <p className="refeicao-observacoes">
                <strong>Observações: </strong>
                {refeicao.observacoes}
              </p>
            )}
          </article>
        ))}
      </div>

      <div className="disclaimer-box">
        <strong>Avisos importantes</strong>
        <ul>
          {plano.avisos_importantes.map((aviso) => (
            <li key={aviso}>{aviso}</li>
          ))}
          <li>
            Este plano é apenas informativo e não substitui o acompanhamento por nutricionista ou
            médico.
          </li>
        </ul>
      </div>
    </div>
  );
}

