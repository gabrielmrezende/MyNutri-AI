import type { Anamnese, PlanoResponse } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

export async function gerarPlano(anamnese: Anamnese): Promise<PlanoResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/gerar-plano`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(anamnese)
    });
  } catch (err) {
    const msg =
      err instanceof TypeError && err.message === "Failed to fetch"
        ? "Não foi possível conectar à API. O backend está rodando? Inicie-o com: uvicorn app.main:app --reload (na pasta backend) e teste em http://127.0.0.1:8000/health"
        : err instanceof Error
          ? err.message
          : "Erro de rede. Verifique se o backend está rodando em " + API_BASE_URL;
    throw new Error(msg);
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Erro ao gerar plano alimentar. Tente novamente.");
  }

  return (await response.json()) as PlanoResponse;
}

