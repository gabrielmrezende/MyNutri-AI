import { useState } from "react";
import type { PlanoAlimentar, Refeicao } from "../types";
import { DietDashboard } from "./DietDashboard";
import { gerarPdfPlano } from "../utils/gerarPdfPlano";

type Props = {
  plano: PlanoAlimentar | null;
  loading: boolean;
  error: string | null;
};

function RefeicaoDetalheModal({
  refeicao,
  onFechar,
}: {
  refeicao: Refeicao;
  onFechar: () => void;
}) {
  const temItens = refeicao.itens && refeicao.itens.length > 0;

  return (
    <div
      className="refeicao-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="refeicao-modal-titulo"
      onClick={onFechar}
    >
      <div
        className="refeicao-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="refeicao-modal-header">
          <h2 id="refeicao-modal-titulo">{refeicao.nome}</h2>
          {refeicao.horario_sugerido && (
            <span className="refeicao-modal-horario">{refeicao.horario_sugerido}</span>
          )}
          <button
            type="button"
            className="refeicao-modal-fechar"
            onClick={onFechar}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <div className="refeicao-modal-body">
          <p className="refeicao-modal-descricao">{refeicao.descricao}</p>

          {temItens && (
            <div className="refeicao-modal-itens">
              <h3>Quantidades e porções</h3>
              <table className="refeicao-tabela">
                <thead>
                  <tr>
                    <th>Alimento / preparação</th>
                    <th>Quantidade</th>
                    <th>Unidade</th>
                  </tr>
                </thead>
                <tbody>
                  {refeicao.itens!.map((item, i) => (
                    <tr key={i}>
                      <td>{item.nome}</td>
                      <td>{item.quantidade ?? "—"}</td>
                      <td>{item.unidade ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {refeicao.observacoes && (
            <div className="refeicao-modal-observacoes">
              <strong>Observações:</strong> {refeicao.observacoes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PlanView({ plano, loading, error }: Props) {
  const [refeicaoSelecionada, setRefeicaoSelecionada] = useState<Refeicao | null>(null);

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
    <>
      <DietDashboard plano={plano} />

      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            marginBottom: "8px",
          }}
        >
          <h2 style={{ marginBottom: 0 }}>Seu plano alimentar educativo</h2>
          <button type="button" className="secondary" onClick={() => gerarPdfPlano(plano)}>
            Baixar plano em PDF
          </button>
        </div>
        <p>{plano.resumo_geral}</p>

        <h3>Refeições sugeridas</h3>
        <p className="refeicoes-dica">Clique em uma refeição para ver detalhes e quantidades.</p>
        <div className="refeicoes-grid">
          {plano.refeicoes.map((refeicao) => (
            <article
              key={refeicao.nome + (refeicao.horario_sugerido ?? "")}
              className="refeicao-card refeicao-card--clicavel"
              onClick={() => setRefeicaoSelecionada(refeicao)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setRefeicaoSelecionada(refeicao);
                }
              }}
              aria-label={`Ver detalhes: ${refeicao.nome}`}
            >
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
              <span className="refeicao-card-hint">Clique para ver detalhes e gramaturas →</span>
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

      {refeicaoSelecionada && (
        <RefeicaoDetalheModal
          refeicao={refeicaoSelecionada}
          onFechar={() => setRefeicaoSelecionada(null)}
        />
      )}
    </>
  );
}
