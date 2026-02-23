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


class ItemRefeicao(BaseModel):
    """Um item/alimento da refeição com quantidade e unidade (gramatura, porção caseira)."""
    nome: str = Field(description="Nome do alimento ou preparação")
    quantidade: Optional[str] = None  # "50", "1", "2" — pode ser número ou texto (ex.: "1/2")
    unidade: Optional[str] = None  # "g", "ml", "xícara", "fatia", "unidade", "colher de sopa"


class Refeicao(BaseModel):
    nome: str = Field(description="Ex.: Café da manhã, Almoço, Lanche da tarde")
    horario_sugerido: Optional[str] = None
    descricao: str = Field(
        description="Descrição em linguagem acessível, com porções caseiras sempre que possível."
    )
    observacoes: Optional[str] = None
    itens: List[ItemRefeicao] = Field(
        default_factory=list,
        description="Lista opcional de itens com quantidade e unidade (gramatura, porções).",
    )


class PlanoAlimentar(BaseModel):
    resumo_geral: str
    refeicoes: List[Refeicao]
    avisos_importantes: List[str]


class CalculoNutricional(BaseModel):
    """Um cálculo ou estimativa feita pela IA (ex.: IMC, TMB, calorias)."""
    nome: str = Field(description="Ex.: IMC, TMB, Calorias diárias")
    valor: Optional[str] = Field(default=None, description="Resultado ex.: 22,5 ou 1800 kcal")
    unidade: Optional[str] = Field(default=None, description="Ex.: kg/m², kcal")
    descricao: str = Field(description="Explicação em linguagem simples do que foi calculado e como")


class ExplicacaoGeracao(BaseModel):
    """Explicação de como a IA estruturou o plano (transparência e educação)."""
    resumo_raciocinio: Optional[str] = Field(
        default=None,
        description="Parágrafo resumindo a lógica geral usada para montar o plano",
    )
    calculos: List[CalculoNutricional] = Field(
        default_factory=list,
        description="Cálculos feitos (IMC, TMB, necessidade calórica, distribuição de macros etc.)",
    )
    criterios_escolhidos: List[str] = Field(
        default_factory=list,
        description="Critérios que guiaram as escolhas (ex.: número de refeições, horários)",
    )
    adaptacoes_ao_perfil: List[str] = Field(
        default_factory=list,
        description="Como o plano foi adaptado ao perfil (preferências, restrições, objetivo)",
    )


class PlanoResponse(BaseModel):
    plano: PlanoAlimentar
    modelo_utilizado: str
    explicacao_geracao: Optional[ExplicacaoGeracao] = None


# Schemas de autenticação
class UserRegister(BaseModel):
    email: str = Field(..., description="Email do usuário")
    username: str = Field(..., min_length=3, max_length=50, description="Nome de usuário")
    password: str = Field(..., min_length=6, description="Senha (mínimo 6 caracteres)")


class UserLogin(BaseModel):
    username: str = Field(..., description="Nome de usuário ou email")
    password: str = Field(..., description="Senha")


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    email: str
    username: str

    class Config:
        from_attributes = True

