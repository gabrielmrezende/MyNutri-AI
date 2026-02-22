import type { Anamnese, PlanoResponse } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

export interface User {
  id: number;
  email: string;
  username: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

// Funções de autenticação
export async function login(username: string, password: string): Promise<TokenResponse> {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Erro ao fazer login. Verifique suas credenciais.");
  }

  return (await response.json()) as TokenResponse;
}

export async function register(
  email: string,
  username: string,
  password: string
): Promise<User> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, password }),
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
    let errorMessage = "Erro ao registrar usuário.";
    try {
      const errorData = await response.json().catch(() => null);
      if (errorData?.detail) {
        errorMessage = errorData.detail;
      } else {
        const text = await response.text().catch(() => "");
        if (text) errorMessage = text;
      }
    } catch {
      // Se não conseguir ler a resposta, usa mensagem padrão
    }
    throw new Error(errorMessage);
  }

  return (await response.json()) as User;
}

export async function getCurrentUser(token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Não foi possível obter dados do usuário.");
  }

  return (await response.json()) as User;
}

export async function gerarPlano(anamnese: Anamnese): Promise<PlanoResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/gerar-plano`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(anamnese),
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

