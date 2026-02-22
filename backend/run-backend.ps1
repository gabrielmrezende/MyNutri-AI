# Executa o backend a partir da pasta onde este script está
Set-Location $PSScriptRoot

Write-Host "Instalando dependencias (pip)..." -ForegroundColor Cyan
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "Iniciando servidor em http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "Pressione Ctrl+C para parar." -ForegroundColor Gray
uvicorn app.main:app --reload
