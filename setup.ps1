# MedAI Setup Script
# Created by Mridankan Mandal
# Installs all dependencies for server and client

Write-Host "MedAI Setup Script" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "[1/4] Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Install server dependencies
Write-Host ""
Write-Host "[2/4] Installing server dependencies..." -ForegroundColor Yellow
Set-Location -Path "server"
if (Test-Path "package.json") {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Server dependencies installed successfully." -ForegroundColor Green
    } else {
        Write-Host "ERROR: Failed to install server dependencies." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "ERROR: server/package.json not found." -ForegroundColor Red
    exit 1
}

# Check .env file
Write-Host ""
Write-Host "[3/4] Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host ".env file found." -ForegroundColor Green
} else {
    Write-Host "WARNING: .env file not found. Copying from .env.example..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "Please edit server/.env and add your GEMINI_API_KEY." -ForegroundColor Yellow
    } else {
        Write-Host "ERROR: .env.example not found." -ForegroundColor Red
    }
}

# Install client dependencies
Set-Location -Path ".."
Write-Host ""
Write-Host "[4/4] Installing client dependencies..." -ForegroundColor Yellow
Set-Location -Path "client"
if (Test-Path "package.json") {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Client dependencies installed successfully." -ForegroundColor Green
    } else {
        Write-Host "ERROR: Failed to install client dependencies." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "ERROR: client/package.json not found." -ForegroundColor Red
    exit 1
}

# Return to root directory
Set-Location -Path ".."

Write-Host ""
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Edit server/.env and configure your GEMINI_API_KEY" -ForegroundColor White
Write-Host "2. Run ./start.ps1 to start the application" -ForegroundColor White
Write-Host ""
