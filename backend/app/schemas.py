from typing import List, Optional
from pydantic import BaseModel, Field


class PreferenciasAlimentares(BaseModel):
    gosta_de: List[str] = Field(default_factory=list)
    nao_gosta_de: List[str] = Field(default_factory=list)
    restricoes: List[str] = Field(default_factory=list)
    observacoes: Optional[str] = None


class Rotina(BaseModel):
    horario_acordar: Optional[str] = None
    horario_dormir: Optional[str] = None
    refeicoes_por_dia: Optional[int] = None
    trabalha_fora: Optional[bool] = None
    pratica_atividade_fisica: Optional[bool] = None
    descricao_rotina: Optional[str] = None


class DadosBasicos(BaseModel):
    nome: Optional[str] = None
    idade: Optional[int] = None
    peso_kg: Optional[float] = None
    altura_cm: Optional[float] = None
    sexo: Optional[str] = Field(
        default=None, description="Masculino, Feminino, Outro ou Prefiro não informar"
    )
    condicoes_saude: List[str] = Field(
        default_factory=list,
        description=(
            "Condições como diabetes, hipertensão, dislipidemia etc. "
            "O modelo será instruído a não prescrever dieta clínica."
        ),
    )


class Objetivos(BaseModel):
    objetivo_principal: str = Field(
        description="Ex.: emagrecimento, ganho de massa, manutenção, saúde geral"
    )
    objetivos_secundarios: List[str] = Field(default_factory=list)
    prazo_estimado_meses: Optional[int] = None


class Anamnese(BaseModel):
    dados_basicos: DadosBasicos
    rotina: Rotina
    preferencias: PreferenciasAlimentares
    objetivos: Objetivos
    idioma_plano: str = Field(
        default="pt-BR",
        description="Idioma em que o plano será retornado, ex.: pt-BR",
    )


class Refeicao(BaseModel):
    nome: str = Field(description="Ex.: Café da manhã, Almoço, Lanche da tarde")
    horario_sugerido: Optional[str] = None
    descricao: str = Field(
        description="Descrição em linguagem acessível, com porções caseiras sempre que possível."
    )
    observacoes: Optional[str] = None


class PlanoAlimentar(BaseModel):
    resumo_geral: str
    refeicoes: List[Refeicao]
    avisos_importantes: List[str]


class PlanoResponse(BaseModel):
    plano: PlanoAlimentar
    modelo_utilizado: str

