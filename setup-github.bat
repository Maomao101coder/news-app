@echo off
REM NewsHub GitHub Setup Script
REM This script initializes git and pushes your news app to GitHub

setlocal enabledelayedexpansion

echo.
echo ===================================
echo  NewsHub - GitHub Setup Script
echo ===================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from: https://git-scm.com/download/win
    echo Then try running this script again.
    pause
    exit /b 1
)

echo Git is installed!
echo.

REM Navigate to project directory
cd /d "c:\Users\HP\Desktop\mywebsite"

REM Initialize git repository
echo Initializing Git repository...
git init

REM Configure git
echo Configuring Git user...
git config user.name "NewsHub Developer"
git config user.email "user@example.com"

REM Add all files
echo Adding files to Git...
git add .

REM Create initial commit
echo Creating initial commit...
git commit -m "Initial commit: NewsHub - Modern News Application with NewsAPI.org integration"

REM Show git status
echo.
echo Repository Status:
git log --oneline -n 1
echo.

REM Display next steps
echo ===================================
echo  NEXT STEPS:
echo ===================================
echo.
echo 1. Go to: https://github.com/Maomao101coder
echo 2. Click the "+" icon and select "New repository"
echo 3. Name it: "news-app"
echo 4. Click "Create repository"
echo 5. Copy one of the commands below and paste it in PowerShell:
echo.
echo    HTTPS METHOD (recommended for first-time):
echo    git remote add origin https://github.com/Maomao101coder/news-app.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo    (You'll be prompted to login to GitHub)
echo.
echo ===================================
echo.
pause
