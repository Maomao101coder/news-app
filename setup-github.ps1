# NewsHub GitHub Setup Script for PowerShell
# This script initializes git and prepares your app for GitHub

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  NewsHub - GitHub Setup Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Set project directory
$projectDir = "c:\Users\HP\Desktop\mywebsite"
Set-Location $projectDir

Write-Host "Working in: $projectDir" -ForegroundColor Green
Write-Host ""

# Check if Git is installed
try {
    $gitVersion = git --version
    Write-Host "✓ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Read-Host "Press Enter to open download page"
    Start-Process "https://git-scm.com/download/win"
    exit
}

Write-Host ""
Write-Host "Initializing Git repository..." -ForegroundColor Yellow

# Initialize repository
git init
git config user.name "NewsHub Developer"
git config user.email "dev@newshub.local"

Write-Host ""
Write-Host "Adding files to repository..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: NewsHub - Modern News Application with NewsAPI.org integration"

Write-Host ""
Write-Host "Repository created successfully!" -ForegroundColor Green
Write-Host ""
git log --oneline -n 1

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  NEXT STEPS:" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to your GitHub: https://github.com/Maomao101coder" -ForegroundColor White
Write-Host "2. Click the '+' icon → 'New repository'" -ForegroundColor White
Write-Host "3. Repository name: news-app" -ForegroundColor White
Write-Host "4. Description: Modern news application with NewsAPI.org integration" -ForegroundColor White
Write-Host "5. Choose 'Public'" -ForegroundColor White
Write-Host "6. DO NOT initialize with README, .gitignore, or license" -ForegroundColor White
Write-Host "7. Click the Create repository button" -ForegroundColor White
Write-Host ""
Write-Host "8. Copy the command below and paste in PowerShell:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   git remote add origin https://github.com/Maomao101coder/news-app.git" -ForegroundColor Cyan
Write-Host "   git branch -M main" -ForegroundColor Cyan
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "9. You will be prompted to authenticate with GitHub" -ForegroundColor Yellow
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
