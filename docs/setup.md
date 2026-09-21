# Setup - Muévete CB

## Requisitos
- Node.js 18+
- MongoDB 7+ (local o Atlas)

## Instalación
```bash
# Opción 1: Script automático
./scripts/dev-setup.sh        # Linux/Mac/Git Bash
.\scripts\dev-setup.ps1       # PowerShell

# Opción 2: Manual
cd backend && npm install
cd ../frontend && npm install
```

## Variables de entorno
```bash
cp backend/.env.example backend/.env
# Editar backend/.env con tus valores
```

## Levantar servicios
```bash
# MongoDB local
docker-compose up -d

# Backend
npm run dev:backend

# Frontend (servir estáticos o Vite)
npm run dev:frontend
```

## Seed datos demo
```bash
npm run seed
```