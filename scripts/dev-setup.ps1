# TODO: npm install en backend + frontend (PowerShell)
Write-Host "Setting up backend..." -ForegroundColor Green
Set-Location backend
npm install

Write-Host "Setting up frontend..." -ForegroundColor Green
Set-Location ../frontend
npm install

Write-Host "Done!" -ForegroundColor Green