---
name: powershell-commands
description: PowerShell command reference and best practices for this repository
user_invocable: true
---

# PowerShell Commands Reference

## Common PowerShell Commands for This Repository

### Navigation & File Operations
```powershell
# List files (equivalent to ls -la)
Get-ChildItem -Force
Get-ChildItem -Recurse -Filter "*.yaml"
Get-ChildItem -Recurse -Filter "*.yml"
Get-ChildItem -Recurse -Filter "*.json"

# Find files
Get-ChildItem -Recurse -Filter "*.env*" | Select-Object FullName, LastWriteTime

# View file content
Get-Content .\plane.env.example
Get-Content .\deploy\docker-compose.plane.yml

# Search in files
Select-String -Pattern "SECRET_KEY" -Path ".\**\*.env*"
Select-String -Pattern "APP_DOMAIN" -Path ".\**\*.yaml", ".\**\*.env*"
```

### Git Operations
```powershell
# Status
git status

# Add files
git add .gitignore
git add deploy/

# Commit
git commit -m "feat: description of changes"

# Push
git push origin preview

# Log
git log --oneline -10
```

### Docker Commands (via SSH to VM)
```powershell
# SSH to VM
ssh -i "C:\Users\devdgo\.ssh\oci-private-service-key.key" ubuntu@100.85.71.97

# Docker Compose on VM
ssh -i "C:\Users\devdgo\.ssh\oci-private-service-key.key" ubuntu@100.85.71.97 "cd ~/plane-devghozt/plane-app && docker compose --env-file plane.env ps"
ssh -i "C:\Users\devdgo\.ssh\oci-private-service-key.key" ubuntu@100.85.71.97 "cd ~/plane-devghozt/plane-app && docker compose --env-file plane.env logs -f proxy"

# SCP files
scp -i "C:\Users\devdgo\.ssh\oci-private-service-key.key" ubuntu@100.85.71.97:~/plane-devghozt/plane-app/plane.env plane.env.vm
```

### Docker Commands (Local)
```powershell
# Build
docker compose build

# Up/Down
docker compose up -d
docker compose down

# Logs
docker compose logs -f api

# Execute in container
docker exec -it plane-app-api-1 bash
```

### Git Operations
```powershell
# Status
git status

# Add and commit
git add .gitignore deploy/
git commit -m "feat: description"

# Push
git push origin preview
```

### Python/Pip (if needed)
```powershell
# Run Python script
python .\scripts\deploy-plane.py

# Install dependencies
pip install -r requirements.txt
```

### Environment Variables
```powershell
# Set temp env var
$env:PLANE_SSH_HOST = "ubuntu@100.85.71.97"
$env:ASSISTANT_SSH_HOST = "ubuntu@100.85.71.97"

# View env vars
Get-ChildItem Env:PLANE*
Get-ChildItem Env:ASSISTANT*
```

### File Operations
```powershell
# Copy with structure
Copy-Item -Path "C:\source\*" -Destination "C:\dest\" -Recurse -Force

# Create directory
New-Item -ItemType Directory -Path "C:\path\to\dir" -Force

# Remove
Remove-Item -Path "C:\path\file" -Force -Recurse

# Test path
Test-Path "C:\path\file"
```

### JSON/Parsing
```powershell
# Parse JSON
$json = Get-Content file.json | ConvertFrom-Json
$json.instance.instance_name

# Convert to JSON
$obj | ConvertTo-Json -Depth 10

# Format output
$object | Format-List
$object | Format-Table
```

### Process Management
```powershell
# Get process
Get-Process -Name "docker"

# Stop process
Stop-Process -Name "process-name" -Force

# Start process
Start-Process "docker" -ArgumentList "compose up -d"
```

### Network
```powershell
# Test connection
Test-NetConnection -ComputerName "devghozt.duckdns.org" -Port 443

# DNS lookup
Resolve-DnsName "devghozt.duckdns.org"

# Port test
Test-NetConnection -ComputerName "100.85.71.97" -Port 443
```

### SSH/SCP
```powershell
# SSH with key
ssh -i "C:\Users\devdgo\.ssh\oci-private-service-key.key" ubuntu@100.85.71.97

# SCP copy
scp -i "C:\Users\devdgo\.ssh\oci-private-service-key.key" ubuntu@100.85.71.97:~/remote/file local-file
scp -i "C:\Users\devdgo\.ssh\oci-private-service-key.key" local-file ubuntu@100.85.71.97:~/remote/file
```

### Git Aliases (Add to profile)
```powershell
# Add to $PROFILE
function gs { git status }
function ga { param($files) git add $files }
function gc { param($msg) git commit -m $msg }
function gp { git push origin (git branch --show-current) }
function gl { git log --oneline -10 }
function gd { git diff }
```

---

## Repository-Specific Commands

### Plane Repository (C:\Users\devdgo\plane)
```powershell
# Deploy
.\deploy\deploy-plane.sh

# Backup secrets
.\deploy\backup-plane-secrets.sh

# Test health
curl -k https://devghozt.duckdns.org/api/instances/
```

### Personal Assistant Repo
```powershell
# Opencode
opencode run "test"

# Deploy assistant-api
bash scripts/ship-assistant-api.sh
```

---

## Safety Notes
- **Never commit secrets** (.env files, keys, passwords)
- **Use .gitignore** for local config files
- **Test locally** before pushing
- **Use feature branches** for changes
- **Run tests** before committing