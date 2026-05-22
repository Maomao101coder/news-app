# Find local IPv4 address
$localIp = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" -and $_.InterfaceAlias -notlike "*Loopback*" } | Select-Object -First 1).IPAddress
if (-not $localIp) { $localIp = "127.0.0.1" }
$port = 8000

# Stop any existing background server and ssh processes
Get-Process -Name "powershell" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*server.ps1*" } | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process -Name "ssh" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\mywebsite\serveo_output.txt" -ErrorAction SilentlyContinue

# Start the server in a separate background process
Start-Process powershell -ArgumentList "-WindowStyle Hidden -File c:\Users\HP\Desktop\mywebsite\server.ps1 -Port $port -LocalIp $localIp"
Start-Sleep -Seconds 2

# Start the Serveo SSH tunnel in the background and redirect output to file
Start-Process powershell -WindowStyle Hidden -ArgumentList "-Command `"ssh -o StrictHostKeyChecking=no -R 80:localhost:$port serveo.net > c:\Users\HP\Desktop\mywebsite\serveo_output.txt 2>&1`""

Write-Host "Starting your mobile tunnel..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Read output to find the forwarding URL
$url = $null
for ($i = 0; $i -lt 5; $i++) {
    if (Test-Path "c:\Users\HP\Desktop\mywebsite\serveo_output.txt") {
        $content = Get-Content -Path "c:\Users\HP\Desktop\mywebsite\serveo_output.txt" -Raw
        if ($content -match "Forwarding HTTP traffic from (https://[a-zA-Z0-9.-]+)") {
            $url = $matches[1]
            break
        }
    }
    Start-Sleep -Seconds 2
}

Clear-Host
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "         VIBE SOCIAL APP MOBILE INSTALLER                 " -ForegroundColor White -BackgroundColor Magenta
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

if ($url) {
    Write-Host "CONGRATULATIONS! Aapka mobile internet link ready hai!" -ForegroundColor Green
    Write-Host "Ye link pure internet par kahin bhi chalegi (no Wi-Fi needed)." -ForegroundColor Green
    Write-Host ""
    Write-Host "👉 APNE PHONE PAR YE STEPS KAREIN:" -ForegroundColor Yellow
    Write-Host "----------------------------------------------------------" -ForegroundColor Gray
    Write-Host "1. Phone ke Google Chrome browser mein ye exact link kholein:" -ForegroundColor White
    Write-Host "   $url" -ForegroundColor Magenta -BackgroundColor White
    Write-Host "2. Chrome ke menu (top-right 3 dots) par click karke" -ForegroundColor White
    Write-Host "   'Install App' ya 'Add to Home screen' par click karein!" -ForegroundColor Green
    Write-Host "----------------------------------------------------------" -ForegroundColor Gray
} else {
    Write-Host "Tunnel connection is taking a bit longer. Please try opening this link on same Wi-Fi:" -ForegroundColor Red
    Write-Host "   http://$($localIp):$port" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Server running... (Close this window to stop the server)" -ForegroundColor DarkGray
Write-Host ""

# Keep running
while ($true) { Start-Sleep -Seconds 60 }
