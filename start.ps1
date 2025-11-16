# MedAI Start Script
# Created by Mridankan Mandal
# Starts both server and client in separate processes

Write-Host "MedAI Startup" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exist
Write-Host "Checking dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "server/node_modules")) {
    Write-Host "ERROR: Server dependencies not installed. Run ./setup.ps1 first." -ForegroundColor Red
    exit 1
}
if (-not (Test-Path "client/node_modules")) {
    Write-Host "ERROR: Client dependencies not installed. Run ./setup.ps1 first." -ForegroundColor Red
    exit 1
}

# Check if .env exists
if (-not (Test-Path "server/.env")) {
    Write-Host "ERROR: server/.env not found. Run ./setup.ps1 and configure your API key." -ForegroundColor Red
    exit 1
}

Write-Host "All dependencies found." -ForegroundColor Green
Write-Host ""

# Start server in background
Write-Host "Starting server on http://localhost:4000..." -ForegroundColor Yellow
$serverPath = Join-Path $PWD "server"
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "Set-Location '$serverPath'; npm start"
Start-Sleep -Seconds 3

# Start client in background
Write-Host "Starting client on http://localhost:5173..." -ForegroundColor Yellow
$clientPath = Join-Path $PWD "client"
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "Set-Location '$clientPath'; npm run dev"
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "MedAI is running!" -ForegroundColor Green
Write-Host ""
Write-Host "Server: http://localhost:4000" -ForegroundColor White
Write-Host "Client: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C in each terminal window to stop." -ForegroundColor Yellow
Write-Host ""
