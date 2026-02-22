# MyNutri AI

Siga os passos abaixo para rodar a aplicação. É preciso **dois terminais** (um para o backend e outro para o frontend).

---

## 1. Backend (API em Python)

### Pré-requisitos
- **Python 3.11 ou superior** instalado ([python.org](https://www.python.org/downloads/))
- **(Opcional)** Chave da API OpenAI para planos gerados por IA. Sem chave, o app roda em modo **protótipo** e devolve um plano de demonstração fixo.

### Passos

1. Abra um terminal (PowerShell ou Prompt de Comando) e vá até a pasta do backend:
   ```powershell
   cd "C:\Users\gabri\OneDrive\Área de Trabalho\MyNutri AI\backend"
   ```
   Se der erro com o caminho, abra a pasta `MyNutri AI\backend` no Explorador de Arquivos, clique na barra de endereço, digite `cmd` e pressione Enter — o terminal abrirá já na pasta certa.

2. **(Opcional)** Para usar a OpenAI e gerar planos reais, crie e edite o **`.env`**:
   ```powershell
   copy .env.example .env
   ```
   No `.env`, defina `OPENAI_API_KEY=sk-sua-chave-aqui`. Se não criar o arquivo ou deixar a chave em branco, o backend funciona normalmente e retorna um plano de demonstração.

3. Instale as dependências:
   ```powershell
   pip install -r requirements.txt
   ```

4. Inicie o servidor:
   ```powershell
   uvicorn app.main:app --reload
   ```

   Deve aparecer algo como: `Uvicorn running on http://127.0.0.1:8000`.  
   Teste no navegador: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health) — deve retornar `{"status":"ok"}`.

---

## 2. Frontend (interface em React)

### Pré-requisitos
- **Node.js 18 ou superior** instalado ([nodejs.org](https://nodejs.org/))

### Passos (escolha uma opção)

**Opção A – Mais fácil (evita erro do PowerShell)**  
1. Abra a pasta `MyNutri AI\frontend` no **Explorador de Arquivos**.  
2. Dê **dois cliques** no arquivo **`run-frontend.cmd`**.  
   Ele instala as dependências e sobe o servidor. Acesse [http://localhost:5173](http://localhost:5173).

**Opção B – Pelo Prompt de Comando (cmd)**  
1. No Explorador, abra a pasta `MyNutri AI\frontend`, clique na **barra de endereço**, digite **`cmd`** e pressione Enter.  
2. No terminal que abrir, rode:
   ```bat
   npm install
   npm run dev
   ```

**Opção C – PowerShell (se já tiver liberado scripts)**  
1. Vá até a pasta do frontend e rode:
   ```powershell
   npm install
   npm run dev
   ```

Se aparecer erro dizendo que *a execução de scripts foi desabilitada*, use a **Opção A** ou **Opção B** (o `.cmd` e o Prompt de Comando não dependem da política de scripts do PowerShell).

---

## Resumo

| O que        | Onde rodar              | Comando                          | URL                    |
|-------------|-------------------------|----------------------------------|------------------------|
| **Backend** | Pasta `backend`         | `uvicorn app.main:app --reload`  | http://127.0.0.1:8000  |
| **Frontend**| Pasta `frontend`        | `npm run dev`                    | http://localhost:5173  |

- Deixe os dois terminais abertos enquanto usar o app.
- O frontend chama a API em `http://127.0.0.1:8000` por padrão. Se a API estiver em outra URL, crie na pasta `frontend` um arquivo `.env.local` com:
  ```
  VITE_API_BASE_URL=http://127.0.0.1:8000
  ```

---

## Erros comuns

- **Backend: "No module named 'pydantic_settings'"**  
  Rode: `pip install -r requirements.txt`.

- **"Failed to fetch" ao gerar o plano**  
  O frontend não conseguiu falar com o backend. **Deixe o backend rodando** antes de usar "Gerar plano": abra um terminal na pasta `backend` e rode `uvicorn app.main:app --reload`. Teste no navegador: http://127.0.0.1:8000/health deve retornar `{"status":"ok"}`.

- **Frontend: página em branco ou erro de rede**  
  Confira se o backend está rodando em http://127.0.0.1:8000 e se em http://127.0.0.1:8000/health retorna `{"status":"ok"}`.

- **PowerShell: "a execução de scripts foi desabilitada" ao rodar `npm`**  
  Use o **Prompt de Comando (cmd)** em vez do PowerShell: abra a pasta `frontend` no Explorador, na barra de endereço digite `cmd` e Enter, depois rode `npm install` e `npm run dev`. Ou dê dois cliques em **`run-frontend.cmd`** dentro da pasta `frontend`.  
  Se quiser liberar scripts no PowerShell (apenas para o seu usuário), abra o PowerShell como administrador e rode:  
  `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

- **Caminho com "Área de Trabalho" não funciona no terminal**  
  Use o truque do Explorador de Arquivos: abra a pasta desejada, clique na barra de endereço, digite `cmd` e Enter.
