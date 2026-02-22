# Diagnóstico de Problemas - MyNutri AI

## Erro: "Failed to fetch" ao registrar usuário

Este erro geralmente indica que o **backend não está rodando** ou não está acessível.

### Passos para diagnosticar:

1. **Verifique se o backend está rodando:**
   - Abra um terminal na pasta `backend`
   - Execute: `uvicorn app.main:app --reload`
   - Você deve ver: `Uvicorn running on http://127.0.0.1:8000`

2. **Teste o endpoint de health:**
   - Abra no navegador: http://127.0.0.1:8000/health
   - Deve retornar: `{"status":"ok"}`

3. **Teste o endpoint de registro diretamente:**
   - Abra: http://127.0.0.1:8000/docs
   - Vá até `/api/auth/register`
   - Tente fazer um POST com:
     ```json
     {
       "email": "teste@teste.com",
       "username": "teste",
       "password": "senha123"
     }
     ```

4. **Verifique se há erros no terminal do backend:**
   - Procure por mensagens de erro em vermelho
   - Erros comuns:
     - `ModuleNotFoundError`: Execute `pip install -r requirements.txt`
     - Erro de banco de dados: Verifique permissões na pasta `backend`

5. **Verifique a URL da API no frontend:**
   - O frontend usa: `http://127.0.0.1:8000` por padrão
   - Se o backend estiver em outra porta, crie `frontend/.env.local`:
     ```
     VITE_API_BASE_URL=http://127.0.0.1:8000
     ```

### Solução rápida:

1. **Pare o backend** (Ctrl+C no terminal)
2. **Reinstale as dependências:**
   ```cmd
   cd backend
   pip install -r requirements.txt
   ```
3. **Inicie o backend novamente:**
   ```cmd
   uvicorn app.main:app --reload
   ```
4. **Verifique se está funcionando:**
   - Acesse: http://127.0.0.1:8000/health
   - Deve retornar: `{"status":"ok"}`

### Se ainda não funcionar:

- Verifique se a porta 8000 está livre
- Verifique se há firewall bloqueando
- Tente usar `http://localhost:8000` em vez de `http://127.0.0.1:8000`
