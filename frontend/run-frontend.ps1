# Executa o frontend a partir da pasta onde este script está
Set-Location $PSScriptRoot

Write-Host "Instalando dependencias (npm)..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "Iniciando frontend em http://localhost:5173" -ForegroundColor Green
Write-Host "Pressione Ctrl+C para parar." -ForegroundColor Gray
npm run dev
