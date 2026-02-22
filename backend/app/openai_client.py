import json
from typing import Any, Dict

from fastapi import HTTPException
from openai import OpenAI

from .config import get_settings
from .schemas import Anamnese, PlanoAlimentar


def _get_client():
    settings = get_settings()
    if not settings.openai_api_key or not settings.openai_api_key.strip():
        return None
    return OpenAI(api_key=settings.openai_api_key)


SYSTEM_PROMPT = """
Você é um assistente de nutrição que gera planos alimentares apenas para fins EDUCATIVOS.
Você NÃO substitui um nutricionista ou médico e deve sempre recomendar acompanhamento profissional,
especialmente em casos de doenças crônicas (diabetes, hipertensão, dislipidemias, doenças renais etc.).

Regras importantes:
- Não faça prescrição clínica (não fale em doses de medicamentos, não ajuste insulina, não defina restrições rígidas para doenças).
- Use linguagem simples e acessível.
- Use porções em medidas caseiras sempre que possível (colher de sopa, xícara, fatia, unidade média etc.).
- Respeite as preferências, restrições alimentares e contexto cultural sempre que informado.
- Se as informações forem insuficientes, assuma um contexto geral saudável e destaque que o plano é apenas um exemplo.

FORMATO DA RESPOSTA:
Você DEVE responder estritamente em JSON válido. Cada refeição pode incluir opcionalmente "itens" com alimentos e quantidades (gramatura ou porção caseira):
{
  "resumo_geral": "texto",
  "refeicoes": [
    {
      "nome": "Café da manhã",
      "horario_sugerido": "07:00",
      "descricao": "texto resumido",
      "observacoes": "texto opcional",
      "itens": [
        { "nome": "Pão integral", "quantidade": "2", "unidade": "fatia" },
        { "nome": "Queijo branco", "quantidade": "30", "unidade": "g" },
        { "nome": "Banana", "quantidade": "1", "unidade": "unidade média" }
      ]
    }
  ],
  "avisos_importantes": ["texto 1", "texto 2"]
}
O campo "itens" é opcional. Use "quantidade" como número ou texto (ex.: "1/2") e "unidade" como "g", "ml", "xícara", "colher de sopa", "fatia", "unidade", etc.
"""


def build_user_prompt(anamnese: Anamnese) -> str:
    return json.dumps(anamnese.model_dump(), ensure_ascii=False, indent=2)


def _plano_demonstracao(_anamnese: Anamnese) -> PlanoAlimentar:
    """Plano de exemplo quando não há chave da OpenAI (protótipo)."""
    objetivo = _anamnese.objetivos.objetivo_principal or "saúde geral"
    return PlanoAlimentar(
        resumo_geral=(
            f"Este é um plano alimentar de demonstração, pensado como apoio informativo "
            f"para o objetivo de {objetivo.lower()}. Em produção, um plano personalizado "
            "seria gerado com base na sua anamnese. Este conteúdo é apenas ilustrativo."
        ),
        refeicoes=[
            {
                "nome": "Café da manhã",
                "horario_sugerido": "07:00",
                "descricao": "1 xícara de café com leite ou chá; 2 fatias de pão integral com queijo branco ou geleia sem açúcar; 1 fruta (ex.: banana ou maçã).",
                "observacoes": "Priorize proteína e fibras para manter a saciedade.",
                "itens": [
                    {"nome": "Café com leite ou chá", "quantidade": "1", "unidade": "xícara"},
                    {"nome": "Pão integral", "quantidade": "2", "unidade": "fatia"},
                    {"nome": "Queijo branco ou geleia sem açúcar", "quantidade": "1", "unidade": "colher de sopa"},
                    {"nome": "Banana ou maçã", "quantidade": "1", "unidade": "unidade média"},
                ],
            },
            {
                "nome": "Lanche da manhã",
                "horario_sugerido": "10:00",
                "descricao": "1 porção de fruta ou iogurte natural; ou um punhado de castanhas.",
                "observacoes": None,
                "itens": [
                    {"nome": "Iogurte natural", "quantidade": "1", "unidade": "pote 170g"},
                    {"nome": "Fruta (ex.: maçã)", "quantidade": "1", "unidade": "unidade média"},
                    {"nome": "Castanhas (alternativa)", "quantidade": "30", "unidade": "g"},
                ],
            },
            {
                "nome": "Almoço",
                "horario_sugerido": "12:30",
                "descricao": "Prato com metade do prato de vegetais (salada ou legumes), 1/4 de proteína (frango, peixe, ovo ou leguminosas) e 1/4 de carboidrato (arroz, batata ou massa integral).",
                "observacoes": "Use medidas caseiras: 1 concha, 1 filé do tamanho da palma da mão.",
                "itens": [
                    {"nome": "Salada ou legumes (variados)", "quantidade": "2", "unidade": "colher de servir"},
                    {"nome": "Frango grelhado ou peixe", "quantidade": "100", "unidade": "g"},
                    {"nome": "Arroz integral", "quantidade": "3", "unidade": "colher de servir"},
                    {"nome": "Feijão (opcional)", "quantidade": "1", "unidade": "concha"},
                ],
            },
            {
                "nome": "Lanche da tarde",
                "horario_sugerido": "16:00",
                "descricao": "Iogurte, fruta, sanduíche leve com pão integral ou vitamina de frutas.",
                "observacoes": None,
                "itens": [
                    {"nome": "Pão integral", "quantidade": "2", "unidade": "fatia"},
                    {"nome": "Queijo ou peito de peru", "quantidade": "30", "unidade": "g"},
                    {"nome": "Suco ou vitamina de frutas", "quantidade": "200", "unidade": "ml"},
                ],
            },
            {
                "nome": "Jantar",
                "horario_sugerido": "19:30",
                "descricao": "Similar ao almoço, em porções um pouco menores. Sopas e saladas com proteína também são boas opções.",
                "observacoes": "Evite refeições pesadas perto do horário de dormir.",
                "itens": [
                    {"nome": "Proteína (frango, peixe ou ovo)", "quantidade": "80", "unidade": "g"},
                    {"nome": "Vegetais cozidos ou salada", "quantidade": "2", "unidade": "colher de servir"},
                    {"nome": "Carboidrato (arroz ou batata)", "quantidade": "2", "unidade": "colher de servir"},
                ],
            },
        ],
        avisos_importantes=[
            "Este plano é apenas informativo e de demonstração.",
            "Não substitui acompanhamento por nutricionista ou médico.",
            "Para um plano personalizado de verdade, configure a chave da OpenAI ou consulte um profissional.",
        ],
    )


def gerar_plano(anamnese: Anamnese) -> tuple[PlanoAlimentar, str]:
    settings = get_settings()
    client = _get_client()
    if client is None:
        return _plano_demonstracao(anamnese), "demonstracao"

    try:
        completion = client.chat.completions.create(
            model=settings.openai_model or "gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": (
                        "Gere um plano alimentar educativo a partir da seguinte anamnese. "
                        "Responda no idioma indicado em 'idioma_plano'. "
                        "Lembre-se de retornar ESTRITAMENTE no formato JSON especificado.\n\n"
                        f"{build_user_prompt(anamnese)}"
                    ),
                },
            ],
            temperature=0.7,
        )
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Erro ao chamar o modelo de IA: {exc}") from exc

    content = completion.choices[0].message.content or ""

    try:
        data: Dict[str, Any] = json.loads(content)
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=500,
            detail="O modelo retornou uma resposta em formato inesperado. Tente novamente em alguns instantes.",
        ) from exc

    try:
        plano = PlanoAlimentar.model_validate(data)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(
            status_code=500,
            detail="Não foi possível interpretar o plano alimentar retornado pela IA.",
        ) from exc

    return plano, settings.openai_model or "gpt-4o-mini"

