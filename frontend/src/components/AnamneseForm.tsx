import { useState } from "react";
import type { Anamnese, DadosBasicos, Objetivos, PreferenciasAlimentares, Rotina } from "../types";

type Props = {
  onSubmit: (data: Anamnese) => void;
  loading: boolean;
};

type Step = 1 | 2 | 3 | 4;

const defaultDadosBasicos: DadosBasicos = {
  nome: "",
  idade: undefined,
  peso_kg: undefined,
  altura_cm: undefined,
  sexo: "",
  condicoes_saude: []
};

const defaultRotina: Rotina = {
  horario_acordar: "",
  horario_dormir: "",
  refeicoes_por_dia: undefined,
  trabalha_fora: undefined,
  pratica_atividade_fisica: undefined,
  descricao_rotina: ""
};

const defaultPreferencias: PreferenciasAlimentares = {
  gosta_de: [],
  nao_gosta_de: [],
  restricoes: [],
  observacoes: ""
};

const defaultObjetivos: Objetivos = {
  objetivo_principal: "Saúde geral",
  objetivos_secundarios: [],
  prazo_estimado_meses: undefined
};

export function AnamneseForm({ onSubmit, loading }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [dadosBasicos, setDadosBasicos] = useState<DadosBasicos>(defaultDadosBasicos);
  const [rotina, setRotina] = useState<Rotina>(defaultRotina);
  const [preferencias, setPreferencias] = useState<PreferenciasAlimentares>(defaultPreferencias);
  const [objetivos, setObjetivos] = useState<Objetivos>(defaultObjetivos);
  const [idiomaPlano, setIdiomaPlano] = useState("pt-BR");

  const handleNext = () => setStep((prev) => (prev < 4 ? ((prev + 1) as Step) : prev));
  const handleBack = () => setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Anamnese = {
      dados_basicos: {
        ...dadosBasicos,
        condicoes_saude: (dadosBasicos.condicoes_saude ?? []).filter(Boolean)
      },
      rotina,
      preferencias: {
        ...preferencias,
        gosta_de: preferencias.gosta_de.filter(Boolean),
        nao_gosta_de: preferencias.nao_gosta_de.filter(Boolean),
        restricoes: preferencias.restricoes.filter(Boolean)
      },
      objetivos: {
        ...objetivos,
        objetivos_secundarios: objetivos.objetivos_secundarios.filter(Boolean)
      },
      idioma_plano: idiomaPlano
    };
    onSubmit(payload);
  };

  const updateStringArray =
    (field: keyof PreferenciasAlimentares | "condicoes_saude" | "objetivos_secundarios") =>
    (value: string) => {
      const parts = value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      if (field === "condicoes_saude") {
        setDadosBasicos((prev) => ({ ...prev, condicoes_saude: parts }));
      } else if (field === "objetivos_secundarios") {
        setObjetivos((prev) => ({ ...prev, objetivos_secundarios: parts }));
      } else {
        setPreferencias((prev) => ({ ...prev, [field]: parts }));
      }
    };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="steps">
        <span className={step === 1 ? "step active" : "step"}>1. Dados básicos</span>
        <span className={step === 2 ? "step active" : "step"}>2. Rotina</span>
        <span className={step === 3 ? "step active" : "step"}>3. Preferências</span>
        <span className={step === 4 ? "step active" : "step"}>4. Objetivos</span>
      </div>

      {step === 1 && (
        <div className="form-grid">
          <label>
            Nome (opcional)
            <input
              type="text"
              value={dadosBasicos.nome ?? ""}
              onChange={(e) => setDadosBasicos((prev) => ({ ...prev, nome: e.target.value }))}
            />
          </label>
          <label>
            Idade (anos)
            <input
              type="number"
              min={1}
              value={dadosBasicos.idade ?? ""}
              onChange={(e) =>
                setDadosBasicos((prev) => ({
                  ...prev,
                  idade: e.target.value ? Number(e.target.value) : undefined
                }))
              }
            />
          </label>
          <label>
            Peso aproximado (kg)
            <input
              type="number"
              step="0.1"
              value={dadosBasicos.peso_kg ?? ""}
              onChange={(e) =>
                setDadosBasicos((prev) => ({
                  ...prev,
                  peso_kg: e.target.value ? Number(e.target.value) : undefined
                }))
              }
            />
          </label>
          <label>
            Altura aproximada (cm)
            <input
              type="number"
              value={dadosBasicos.altura_cm ?? ""}
              onChange={(e) =>
                setDadosBasicos((prev) => ({
                  ...prev,
                  altura_cm: e.target.value ? Number(e.target.value) : undefined
                }))
              }
            />
          </label>
          <label>
            Sexo (opcional)
            <select
              value={dadosBasicos.sexo ?? ""}
              onChange={(e) =>
                setDadosBasicos((prev) => ({
                  ...prev,
                  sexo: e.target.value || undefined
                }))
              }
            >
              <option value="">Prefiro não informar</option>
              <option value="Feminino">Feminino</option>
              <option value="Masculino">Masculino</option>
              <option value="Outro">Outro</option>
            </select>
          </label>
          <label className="full-width">
            Condições de saúde relevantes (separadas por vírgula)
            <input
              type="text"
              placeholder="Ex.: diabetes tipo 2, hipertensão"
              onChange={(e) => updateStringArray("condicoes_saude")(e.target.value)}
            />
            <small>
              A ferramenta não faz prescrição clínica. Essas informações servem apenas para gerar
              orientações gerais e reforçar a importância de acompanhamento profissional.
            </small>
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="form-grid">
          <label>
            Horário em que costuma acordar
            <input
              type="time"
              value={rotina.horario_acordar ?? ""}
              onChange={(e) =>
                setRotina((prev) => ({
                  ...prev,
                  horario_acordar: e.target.value || undefined
                }))
              }
            />
          </label>
          <label>
            Horário em que costuma dormir
            <input
              type="time"
              value={rotina.horario_dormir ?? ""}
              onChange={(e) =>
                setRotina((prev) => ({
                  ...prev,
                  horario_dormir: e.target.value || undefined
                }))
              }
            />
          </label>
          <label>
            Quantas refeições costuma fazer por dia?
            <input
              type="number"
              min={1}
              max={8}
              value={rotina.refeicoes_por_dia ?? ""}
              onChange={(e) =>
                setRotina((prev) => ({
                  ...prev,
                  refeicoes_por_dia: e.target.value ? Number(e.target.value) : undefined
                }))
              }
            />
          </label>
          <label>
            Você trabalha/estuda fora de casa na maior parte do dia?
            <select
              value={
                rotina.trabalha_fora === undefined ? "" : rotina.trabalha_fora ? "sim" : "nao"
              }
              onChange={(e) =>
                setRotina((prev) => ({
                  ...prev,
                  trabalha_fora: e.target.value === "" ? undefined : e.target.value === "sim"
                }))
              }
            >
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </label>
          <label>
            Você pratica atividade física regularmente?
            <select
              value={
                rotina.pratica_atividade_fisica === undefined
                  ? ""
                  : rotina.pratica_atividade_fisica
                  ? "sim"
                  : "nao"
              }
              onChange={(e) =>
                setRotina((prev) => ({
                  ...prev,
                  pratica_atividade_fisica:
                    e.target.value === "" ? undefined : e.target.value === "sim"
                }))
              }
            >
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </label>
          <label className="full-width">
            Descreva brevemente sua rotina
            <textarea
              rows={3}
              value={rotina.descricao_rotina ?? ""}
              onChange={(e) =>
                setRotina((prev) => ({
                  ...prev,
                  descricao_rotina: e.target.value || undefined
                }))
              }
            />
          </label>
        </div>
      )}

      {step === 3 && (
        <div className="form-grid">
          <label className="full-width">
            Alimentos/pratos que você gosta (separados por vírgula)
            <input
              type="text"
              onChange={(e) => updateStringArray("gosta_de")(e.target.value)}
            />
          </label>
          <label className="full-width">
            Alimentos/pratos que você não gosta (separados por vírgula)
            <input
              type="text"
              onChange={(e) => updateStringArray("nao_gosta_de")(e.target.value)}
            />
          </label>
          <label className="full-width">
            Restrições alimentares (alergias, intolerâncias, religião, veg/vegetariano etc.)
            <input
              type="text"
              placeholder="Ex.: lactose, glúten, vegetariano"
              onChange={(e) => updateStringArray("restricoes")(e.target.value)}
            />
          </label>
          <label className="full-width">
            Observações adicionais sobre alimentação
            <textarea
              rows={3}
              value={preferencias.observacoes ?? ""}
              onChange={(e) =>
                setPreferencias((prev) => ({
                  ...prev,
                  observacoes: e.target.value || undefined
                }))
              }
            />
          </label>
        </div>
      )}

      {step === 4 && (
        <div className="form-grid">
          <label className="full-width">
            Objetivo principal
            <select
              value={objetivos.objetivo_principal}
              onChange={(e) =>
                setObjetivos((prev) => ({
                  ...prev,
                  objetivo_principal: e.target.value
                }))
              }
            >
              <option value="Saúde geral">Melhorar saúde geral</option>
              <option value="Emagrecimento">Emagrecimento</option>
              <option value="Ganho de massa">Ganho de massa</option>
              <option value="Manutenção de peso">Manutenção de peso</option>
            </select>
          </label>
          <label className="full-width">
            Objetivos secundários (separados por vírgula)
            <input
              type="text"
              placeholder="Ex.: mais energia, melhorar sono"
              onChange={(e) => updateStringArray("objetivos_secundarios")(e.target.value)}
            />
          </label>
          <label>
            Em quanto tempo você gostaria de perceber mudanças? (meses, opcional)
            <input
              type="number"
              min={1}
              max={36}
              value={objetivos.prazo_estimado_meses ?? ""}
              onChange={(e) =>
                setObjetivos((prev) => ({
                  ...prev,
                  prazo_estimado_meses: e.target.value ? Number(e.target.value) : undefined
                }))
              }
            />
          </label>
          <label>
            Idioma do plano
            <select value={idiomaPlano} onChange={(e) => setIdiomaPlano(e.target.value)}>
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en">Inglês</option>
            </select>
          </label>
          <div className="disclaimer-box full-width">
            <strong>Aviso importante</strong>
            <p>
              Esta ferramenta é apenas um apoio informativo e educativo. Ela não substitui o
              acompanhamento com nutricionista ou médico. Em casos de doenças ou uso de
              medicamentos, procure sempre um profissional de saúde.
            </p>
          </div>
        </div>
      )}

      <div className="form-footer">
        {step > 1 && (
          <button type="button" className="secondary" onClick={handleBack} disabled={loading}>
            Voltar
          </button>
        )}
        {step < 4 && (
          <button type="button" onClick={handleNext} disabled={loading}>
            Próximo
          </button>
        )}
        {step === 4 && (
          <button type="submit" disabled={loading}>
            {loading ? "Gerando plano..." : "Gerar plano alimentar"}
          </button>
        )}
      </div>
    </form>
  );
}

