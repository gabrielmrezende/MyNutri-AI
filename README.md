# MyNutri AI

Sistema de planejamento alimentar educativo com IA. **Agora com sistema de autenticação de usuários!**

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

3. **Instale as dependências** (incluindo as novas para autenticação):
   ```powershell
   pip install -r requirements.txt
   ```
   
   Isso instalará: FastAPI, SQLAlchemy (banco de dados), bcrypt (hash de senhas), python-jose (JWT), entre outras.

4. Inicie o servidor:
   ```powershell
   uvicorn app.main:app --reload
   ```

   Deve aparecer algo como: `Uvicorn running on http://127.0.0.1:8000`.  
   - O banco de dados SQLite (`mynutri.db`) será criado automaticamente na primeira execução.
   - Teste no navegador: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health) — deve retornar `{"status":"ok"}`.
   - Documentação da API: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

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

---

## Sistema de Autenticação

O sistema agora requer **login ou registro** antes de usar:

1. **Primeira vez?** Clique em "Registre-se" na tela de login
2. Preencha: email, nome de usuário e senha (mínimo 6 caracteres)
3. Após o registro, você será logado automaticamente
4. **Já tem conta?** Faça login com seu nome de usuário/email e senha

**Nota:** O token de autenticação fica salvo no navegador. Você só precisa fazer login novamente se:
- Fizer logout manualmente
- Limpar os dados do navegador
- O token expirar (após 7 dias)

---

## Erros comuns

- **Backend: "No module named 'pydantic_settings'" ou "No module named 'sqlalchemy'"**  
  Rode: `pip install -r requirements.txt` para instalar todas as dependências.

- **Backend: Erro ao iniciar relacionado ao banco de dados**  
  Certifique-se de que tem permissão de escrita na pasta `backend`. O arquivo `mynutri.db` será criado automaticamente.

- **"Failed to fetch" ao gerar o plano**  
  O frontend não conseguiu falar com o backend. **Deixe o backend rodando** antes de usar "Gerar plano": abra um terminal na pasta `backend` e rode `uvicorn app.main:app --reload`. Teste no navegador: http://127.0.0.1:8000/health deve retornar `{"status":"ok"}`.

- **Frontend: "Sessão expirada" ou erro 401**  
  Faça logout e login novamente. O token pode ter expirado ou sido invalidado.

- **Frontend: página em branco ou erro de rede**  
  Confira se o backend está rodando em http://127.0.0.1:8000 e se em http://127.0.0.1:8000/health retorna `{"status":"ok"}`.

- **PowerShell: "a execução de scripts foi desabilitada" ao rodar `npm`**  
  Use o **Prompt de Comando (cmd)** em vez do PowerShell: abra a pasta `frontend` no Explorador, na barra de endereço digite `cmd` e Enter, depois rode `npm install` e `npm run dev`. Ou dê dois cliques em **`run-frontend.cmd`** dentro da pasta `frontend`.  
  Se quiser liberar scripts no PowerShell (apenas para o seu usuário), abra o PowerShell como administrador e rode:  
  `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

- **Caminho com "Área de Trabalho" não funciona no terminal**  
  Use o truque do Explorador de Arquivos: abra a pasta desejada, clique na barra de endereço, digite `cmd` e Enter.
