$env:Path = 'C:\Program Files\Git\bin;' + $en "c:\Users\HP\Desktop\mywebsite"

Write-Host "Adding remote origin..." -ForegroundColor Cyan
git remote add origin https://github.com/Maomao101coder/news-app.git

Write-Host "Renaming branch to main..." -ForegroundColor Cyan
git branch -M main

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push -u origin main

Write-Host ""
Write-Host "Success! Your NewsHub app is now on GitHub!" -ForegroundColor Green
Write-Host "Repository: https://github.com/Maomao101coder/news-app" -ForegroundColor Green
