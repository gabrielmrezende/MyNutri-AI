from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .openai_client import gerar_plano
from .schemas import Anamnese, PlanoResponse
from .database import init_db
from .models import User  # Importa antes de init_db() para registrar tabelas (auth pode ser reativada depois)


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="MyNutri AI - API",
        description="API para geração de planos alimentares educativos com IA.",
        version="0.1.0",
    )

    # Permite frontend em localhost e 127.0.0.1 (evita "Failed to fetch" por CORS)
    origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        settings.frontend_origin,
    ]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(dict.fromkeys(origins)),  # sem duplicatas
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Inicializa banco de dados (importa models primeiro para registrar as tabelas)
    init_db()

    @app.get("/health")
    async def health() -> dict:
        return {"status": "ok"}

    @app.post("/api/gerar-plano", response_model=PlanoResponse)
    async def api_gerar_plano(anamnese: Anamnese) -> PlanoResponse:
        """Gera plano alimentar (uso fictício, sem autenticação por enquanto)."""
        plano, modelo = gerar_plano(anamnese)
        return PlanoResponse(plano=plano, modelo_utilizado=modelo)

    return app


app = create_app()

