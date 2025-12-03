# API Bancária - Desafio Técnico

Sistema bancário completo com API REST e interface web.

## 🛠 Tecnologias

- **Backend**: Node.js + TypeScript + PostgreSQL
- **Frontend**: React + TypeScript
- **Containerização**: Docker Compose

## 📁 Estrutura
/apps/api   - API REST em Node.js
/apps/web   - Interface React
/types      - Tipos TypeScript compartilhados

## ⚙️ Setup

1. Copie o arquivo de ambiente:
```bash
cp .env.example .env
```

2. Suba os containers:
```bash
docker-compose up
```

3. Acesse:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Swagger: http://localhost:3001/api-docs

## 📝 Scripts

- `npm run dev` - Desenvolvimento
- `npm run build` - Build de produção
- `npm run lint` - Verificar código
- `npm run format` - Formatar código
