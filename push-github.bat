@echo off
cd /d "c:\Users\HP\Desktop\mywebsite"

echo Adding remote origin...
"C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/Maomao101coder/news-app.git

echo Renaming branch to main...
"C:\Program Files\Git\bin\git.exe" branch -M main

echo.
echo Pushing to GitHub...
echo You will be asked to authenticate. Use your GitHub username and personal access token.
echo.
"C:\Program Files\Git\bin\git.exe" push -u origin main

echo.
echo Success! Your app is now on GitHub!
echo Visit: https://github.com/Maomao101coder/news-app
echo.
pause
