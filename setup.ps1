$projectDir = "c:\Users\HP\Desktop\mywebsite"
Set-Location $projectDir

Write-Host ""
Write-Host "===== NewsHub GitHub Setup =====" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking Git..." -ForegroundColor Yellow
$gitPath = where.exe git.exe 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Git found at: $gitPath" -ForegroundColor Green
} else {
    Write-Host "ERROR: Git not found. Please install from: https://git-scm.com/download/win" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Initializing repository..." -ForegroundColor Yellow
git init
git config user.name "NewsHub Developer"
git config user.email "dev@newshub.local"
git add .
git commit -m "Initial commit: NewsHub news app"

Write-Host ""
Write-Host "Repository initialized!" -ForegroundColor Green
git log --oneline -n 1

Write-Host ""
Write-Host "===== Next Steps =====" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Visit: https://github.com/Maomao101coder" -ForegroundColor White
Write-Host "2. Click + and select New repository" -ForegroundColor White
Write-Host "3. Name it: news-app" -ForegroundColor White
Write-Host "4. Select Public and click Create" -ForegroundColor White
Write-Host ""
Write-Host "5. Run these commands:" -ForegroundColor Yellow
Write-Host ""
Write-Host "git remote add origin https://github.com/Maomao101coder/news-app.git" -ForegroundColor Cyan
Write-Host "git branch -M main" -ForegroundColor Cyan
Write-Host "git push -u origin main" -ForegroundColor Cyan
Write-Host ""
