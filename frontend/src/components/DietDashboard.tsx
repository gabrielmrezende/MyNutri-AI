import { useState, useMemo } from "react";
import type { PlanoAlimentar } from "../types";
import { estimarNutricao } from "../utils/estimativaNutricional";

type Props = {
  plano: PlanoAlimentar;
};

const R = 24; /* raio no viewBox 0 0 100 100 */
const GROSSURA = 14;
const CIRCUM = 2 * Math.PI * R;

function DonutMacros({
  totais,
  hovered,
  onHover,
}: {
  totais: { proteinPct: number; carbPct: number; fatPct: number; protein: number; carb: number; fat: number };
  hovered: string | null;
  onHover: (id: string | null) => void;
}) {
  const p1 = (totais.proteinPct / 100) * CIRCUM;
  const p2 = (totais.carbPct / 100) * CIRCUM;
  const p3 = (totais.fatPct / 100) * CIRCUM;

  const segmentos = useMemo(
    () => [
      { id: "protein", pct: totais.proteinPct, g: totais.protein, cor: "var(--macro-protein)", dash: p1, offset: 0 },
      { id: "carb", pct: totais.carbPct, g: totais.carb, cor: "var(--macro-carb)", dash: p2, offset: -p1 },
      { id: "fat", pct: totais.fatPct, g: totais.fat, cor: "var(--macro-fat)", dash: p3, offset: -(p1 + p2) },
    ],
    [totais, p1, p2, p3]
  );

  return (
    <div className={`diet-donut-wrap ${hovered ? `diet-donut-wrap--hover-${hovered}` : ""}`}>
      <svg
        className="diet-donut-svg"
        viewBox="0 0 100 100"
        aria-label="Distribuição de macronutrientes"
      >
        <g transform="rotate(-90 50 50)">
          {segmentos.map((s) => (
            <circle
              key={s.id}
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke={s.cor}
              strokeWidth={GROSSURA}
              strokeDasharray={`${s.dash} ${CIRCUM}`}
              strokeDashoffset={s.offset}
              strokeLinecap="round"
              className="diet-donut-segment"
              data-segment={s.id}
              onMouseEnter={() => onHover(s.id)}
              onMouseLeave={() => onHover(null)}
            />
          ))}
        </g>
      </svg>
      <div className="diet-donut-center">
        {hovered ? (
          (() => {
            const s = segmentos.find((x) => x.id === hovered);
            if (!s) return null;
            const labels: Record<string, string> = { protein: "Proteína", carb: "Carboidrato", fat: "Gordura" };
            return (
              <span className="diet-donut-tooltip-inner">
                <strong>{labels[s.id]}</strong>
                {s.g}g · {s.pct}%
              </span>
            );
          })()
        ) : (
          <span className="diet-donut-total-label">Total</span>
        )}
      </div>
    </div>
  );
}

export function DietDashboard({ plano }: Props) {
  const [hoveredMacro, setHoveredMacro] = useState<string | null>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const resumo = estimarNutricao(plano);
  const { totais, porRefeicao, numRefeicoes, horarioInicio, horarioFim } = resumo;
  const maxKcalRef = Math.max(...porRefeicao.map((r) => r.kcal), 1);

  return (
    <div className="diet-dashboard">
      <header className="diet-dashboard-header">
        <h2 className="diet-dashboard-titulo">Visão geral do seu dia</h2>
        <p className="diet-dashboard-subtitulo">
          Valores estimados para fins educativos. Passe o mouse sobre os gráficos para mais detalhes.
        </p>
      </header>

      <div className="diet-dashboard-grid">
        {/* Hero: calorias totais */}
        <div className="diet-card diet-card--hero">
          <div className="diet-hero-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
          <span className="diet-card-label">Calorias totais (estimativa)</span>
          <div className="diet-card-kcal" data-value={totais.totalKcal}>
            {totais.totalKcal.toLocaleString("pt-BR")}
          </div>
          <span className="diet-card-unit">kcal/dia</span>
        </div>

        {/* Gráfico de macros interativo */}
        <div className="diet-card diet-card--macros">
          <h3 className="diet-card-heading">Macronutrientes</h3>
          <DonutMacros totais={totais} hovered={hoveredMacro} onHover={setHoveredMacro} />
          <div className="diet-macro-legend">
            {[
              { id: "protein", label: "Proteína", dot: "diet-macro-dot--protein", g: totais.protein, pct: totais.proteinPct },
              { id: "carb", label: "Carboidrato", dot: "diet-macro-dot--carb", g: totais.carb, pct: totais.carbPct },
              { id: "fat", label: "Gordura", dot: "diet-macro-dot--fat", g: totais.fat, pct: totais.fatPct },
            ].map((m) => (
              <div
                key={m.id}
                className={`diet-macro-item ${hoveredMacro === m.id ? "diet-macro-item--active" : ""}`}
                onMouseEnter={() => setHoveredMacro(m.id)}
                onMouseLeave={() => setHoveredMacro(null)}
              >
                <span className={`diet-macro-dot ${m.dot}`} />
                <span>{m.label}: {m.g}g ({m.pct}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Calorias por refeição - barras interativas */}
        <div className="diet-card diet-card--refeicoes">
          <h3 className="diet-card-heading">Calorias por refeição</h3>
          <div className="diet-bars">
            {porRefeicao.map((r, i) => {
              const pctBar = Math.max(10, (r.kcal / maxKcalRef) * 100);
              const pctTotal = totais.totalKcal > 0 ? Math.round((r.kcal / totais.totalKcal) * 100) : 0;
              const isHovered = hoveredBar === i;
              return (
                <div
                  key={r.nome}
                  className={`diet-bar-row ${isHovered ? "diet-bar-row--hover" : ""}`}
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <div className="diet-bar-label">
                    <span className="diet-bar-nome">{r.nome}</span>
                    {r.horario_sugerido && (
                      <span className="diet-bar-horario">{r.horario_sugerido}</span>
                    )}
                  </div>
                  <div className="diet-bar-track">
                    <div
                      className="diet-bar-fill"
                      style={{ width: `${pctBar}%` }}
                      data-kcal={r.kcal}
                      data-pct={pctTotal}
                    />
                  </div>
                  <span className="diet-bar-value">{r.kcal} kcal</span>
                  {isHovered && (
                    <div className="diet-bar-tooltip" role="tooltip">
                      {r.kcal} kcal · {pctTotal}% do total do dia
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="diet-card diet-card--stat">
          <span className="diet-stat-icon" aria-hidden>🍽️</span>
          <span className="diet-stat-value">{numRefeicoes}</span>
          <span className="diet-stat-label">Refeições</span>
        </div>
        <div className="diet-card diet-card--stat">
          <span className="diet-stat-icon" aria-hidden>🕐</span>
          <span className="diet-stat-value diet-stat-value--small">
            {horarioInicio && horarioFim ? `${horarioInicio} – ${horarioFim}` : "—"}
          </span>
          <span className="diet-stat-label">Horário</span>
        </div>
        <div className="diet-card diet-card--dica">
          <span className="diet-dica-icon" aria-hidden>💧</span>
          <p>
            <strong>Hidratação:</strong> Beba água ao longo do dia (cerca de 2 L para adultos), principalmente entre as refeições.
          </p>
        </div>
      </div>

      <p className="diet-dashboard-aviso">
        As calorias e macros são estimativas. Para valores precisos, consulte um nutricionista.
      </p>
    </div>
  );
}
