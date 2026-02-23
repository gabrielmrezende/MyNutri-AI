import { useState } from "react";
import { AnamneseForm } from "./components/AnamneseForm";
import { PlanView } from "./components/PlanView";
import { RaciocinioIAView } from "./components/RaciocinioIAView";
import { Documentacao } from "./components/Documentacao";
import type { ExplicacaoGeracao, PlanoAlimentar } from "./types";
import { gerarPlano } from "./services/api";
import { EXPLICACAO_GENERICA, PLANO_ALIMENTAR_GENERICO } from "./data/planoGenerico";

type Aba = "app" | "doc";
type AbaResultado = "plano" | "raciocinio";

/** Nome do usuário fictício (sem autenticação por enquanto). */
const USUARIO_FICTICIO = "Usuário demonstração";

function App() {
  const [aba, setAba] = useState<Aba>("app");
  const [abaResultado, setAbaResultado] = useState<AbaResultado>("plano");
  const [plano, setPlano] = useState<PlanoAlimentar | null>(null);
  const [explicacaoGeracao, setExplicacaoGeracao] = useState<ExplicacaoGeracao | null>(null);
  const [modeloUtilizado, setModeloUtilizado] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const usarPlanoGenerico = () => {
    setError(null);
    setPlano(PLANO_ALIMENTAR_GENERICO);
    setExplicacaoGeracao(EXPLICACAO_GENERICA);
    setModeloUtilizado("exemplo");
  };

  const handleSubmit = async (data: Parameters<typeof gerarPlano>[0]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await gerarPlano(data);
      setPlano(response.plano);
      setExplicacaoGeracao(response.explicacao_geracao ?? null);
      setModeloUtilizado(response.modelo_utilizado ?? "");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado";
      const ehErroDeConexao =
        message.includes("Não foi possível conectar") ||
        message.includes("Failed to fetch") ||
        message.includes("Erro de rede");
      if (ehErroDeConexao) {
        setPlano(PLANO_ALIMENTAR_GENERICO);
        setExplicacaoGeracao(EXPLICACAO_GENERICA);
        setModeloUtilizado("exemplo");
        setError(null);
      } else {
        setError(message);
        setPlano(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const mostraFormulario = !plano && !loading && !error;

  const voltarParaAnamnese = () => {
    setPlano(null);
    setExplicacaoGeracao(null);
    setModeloUtilizado("");
    setError(null);
    setAbaResultado("plano");
  };

  return (
    <div className="app">
      <header className="app-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <h1>MyNutri AI</h1>
            <p>
              Planejamento alimentar educativo com apoio de IA, pensado para quem não tem acesso
              fácil a acompanhamento nutricional.
            </p>
          </div>
          <span style={{ fontSize: "0.9rem", color: "#666" }} title="Modo demonstração, sem login">
            {USUARIO_FICTICIO}
          </span>
        </div>
        <nav className="app-tabs" aria-label="Navegação principal">
          <button
            type="button"
            className={`app-tab ${aba === "app" ? "app-tab--active" : ""}`}
            onClick={() => setAba("app")}
          >
            Aplicação
          </button>
          <button
            type="button"
            className={`app-tab ${aba === "doc" ? "app-tab--active" : ""}`}
            onClick={() => setAba("doc")}
          >
            Documentação
          </button>
        </nav>
      </header>

      {aba === "doc" ? (
        <main className="doc-wrapper">
          <Documentacao />
        </main>
      ) : mostraFormulario ? (
        <main className="layout layout--somente-anamnese">
          <section className="layout-column layout-column--anamnese">
            <AnamneseForm onSubmit={handleSubmit} loading={loading} />
            <p className="plano-exemplo-hint">
              Sem o backend?{" "}
              <button type="button" className="link" onClick={usarPlanoGenerico}>
                Ver plano de exemplo
              </button>
            </p>
          </section>
        </main>
      ) : (
        <main className="layout layout--resultado">
          <section className="layout-column layout-column--plano">
            <div className="plano-actions plano-actions--with-tabs">
              <button type="button" className="secondary" onClick={voltarParaAnamnese}>
                ← Nova anamnese
              </button>
              <div className="resultado-tabs" role="tablist" aria-label="Visualização do resultado">
                <button
                  type="button"
                  role="tab"
                  aria-selected={abaResultado === "plano"}
                  aria-controls="painel-plano"
                  id="tab-plano"
                  className={`resultado-tab ${abaResultado === "plano" ? "resultado-tab--active" : ""}`}
                  onClick={() => setAbaResultado("plano")}
                >
                  Seu plano
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={abaResultado === "raciocinio"}
                  aria-controls="painel-raciocinio"
                  id="tab-raciocinio"
                  className={`resultado-tab ${abaResultado === "raciocinio" ? "resultado-tab--active" : ""}`}
                  onClick={() => setAbaResultado("raciocinio")}
                >
                  Como a IA pensou
                </button>
              </div>
            </div>
            <div id="painel-plano" role="tabpanel" aria-labelledby="tab-plano" hidden={abaResultado !== "plano"}>
              <PlanView plano={plano} loading={loading} error={error} />
            </div>
            <div id="painel-raciocinio" role="tabpanel" aria-labelledby="tab-raciocinio" hidden={abaResultado !== "raciocinio"}>
              <RaciocinioIAView explicacao={explicacaoGeracao} modeloUtilizado={modeloUtilizado} />
            </div>
          </section>
        </main>
      )}

      <footer className="app-footer">
        <p>
          Esta ferramenta é apenas informativa e não substitui o acompanhamento individualizado com
          nutricionista ou médico.
        </p>
      </footer>
    </div>
  );
}

export default App;

