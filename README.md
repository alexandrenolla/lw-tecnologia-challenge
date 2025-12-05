# API Bancaria - Desafio Tecnico

Sistema bancario completo com API REST e interface web para simular operacoes bancarias com autenticacao JWT.

## Stack Tecnologica

| Camada   | Tecnologias                                                   |
| -------- | ------------------------------------------------------------- |
| Backend  | Node.js 24, TypeScript (strict), Express, TypeORM, PostgreSQL |
| Frontend | React 18, TypeScript (strict), Vite, React Router             |
| Infra    | Docker Compose                                                |

## Estrutura do Projeto

```
bank-api-monorepo/
├── apps/
│   ├── api/          # Backend Node.js + Express
│   │   └── src/
│   │       ├── config/        # Configuracoes (database, env)
│   │       ├── controllers/   # Validacao e formatacao
│   │       ├── entities/      # Entidades TypeORM
│   │       ├── middlewares/   # Auth e error handling
│   │       ├── routes/        # Definicao de rotas
│   │       ├── services/      # Logica de negocio
│   │       └── server.ts      # Entry point
│   └── web/          # Frontend React + Vite
│       └── src/
│           ├── components/    # Componentes reutilizaveis
│           ├── contexts/      # Context API (auth)
│           ├── pages/         # Login, Dashboard
│           ├── services/      # Comunicacao com API
│           └── types/         # Tipos TypeScript
└── types/            # Tipos compartilhados
```

## Como Rodar

### Pre-requisitos

- Docker
- Docker Compose

### Passos

1. Clone o repositorio e entre na pasta:

```bash
cd lw-tecnologia-challenge
```

2. Copie o arquivo de ambiente:

```bash
cp .env.example .env
```

3. Suba os containers:

```bash
docker-compose up
```

4. Acesse:

| Servico  | URL                            |
| -------- | ------------------------------ |
| Frontend | http://localhost:3000          |
| API      | http://localhost:3001          |
| Swagger  | http://localhost:3001/api-docs |

### Credenciais Padrao

- Usuario: `admin`
- Senha: `admin`

## Endpoints da API

| Metodo | Path                       | Auth | Descricao                        |
| ------ | -------------------------- | :--: | -------------------------------- |
| POST   | `/login`                   | Nao  | Autenticacao (retorna JWT)       |
| GET    | `/balance?account_id={id}` | Sim  | Consultar saldo da conta         |
| POST   | `/event`                   | Sim  | Executar operacao bancaria       |
| POST   | `/reset`                   | Sim  | Limpar todas contas e transacoes |

## Exemplos de Uso

### Login

```bash
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin"}'
```

Resposta:

```json
{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

### Deposito

```bash
curl -X POST http://localhost:3001/event \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"type": "deposit", "destination": "100", "amount": 100}'
```

Resposta:

```json
{ "destination": { "id": "100", "balance": 100 } }
```

### Saque

```bash
curl -X POST http://localhost:3001/event \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"type": "withdraw", "origin": "100", "amount": 30}'
```

Resposta:

```json
{ "origin": { "id": "100", "balance": 70 } }
```

### Transferencia

```bash
curl -X POST http://localhost:3001/event \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"type": "transfer", "origin": "100", "destination": "300", "amount": 20}'
```

Resposta:

```json
{
  "origin": { "id": "100", "balance": 50 },
  "destination": { "id": "300", "balance": 20 }
}
```

### Consultar Saldo

```bash
curl -X GET "http://localhost:3001/balance?account_id=100" \
  -H "Authorization: Bearer SEU_TOKEN"
```

Resposta:

```json
{ "balance": 50 }
```

### Reset

```bash
curl -X POST http://localhost:3001/reset \
  -H "Authorization: Bearer SEU_TOKEN"
```

Resposta:

```json
{ "message": "OK" }
```

## Desenvolvimento

### Scripts Disponiveis

```bash
# Desenvolvimento (todos os workspaces)
npm run dev

# Build de producao
npm run build

# Verificar codigo (ESLint)
npm run lint

# Formatar codigo (Prettier)
npm run format

# Limpar node_modules e builds
npm run clean
```

### Rodar sem Docker

Backend:

```bash
cd apps/api
npm install
npm run dev
```

Frontend:

```bash
cd apps/web
npm install
npm run dev
```

Requer PostgreSQL rodando localmente.

## Arquitetura

### Backend

```
Request → Routes → Controllers → Services → Entities → Database
                       ↓
                  Middlewares (auth, error handling)
```

- **Routes**: Definicao de endpoints e Swagger docs
- **Controllers**: Validacao de input e formatacao de response
- **Services**: Logica de negocio pura
- **Entities**: Modelos TypeORM (User, Account, Transaction)
- **Middlewares**: Autenticacao JWT e tratamento de erros

### Frontend

```
App → AuthProvider → Routes → Pages → Components
                        ↓
                    Services (API)
```

- **Pages**: Login, Dashboard
- **Contexts**: AuthContext (estado global de autenticacao)
- **Services**: Axios com interceptors para JWT
- **Components**: Reutilizaveis (forms, buttons)

## Funcionalidades

- [x] Autenticacao JWT com expiracao de 24h
- [x] Usuario padrao criado automaticamente (admin/admin)
- [x] Deposito (cria conta se nao existe)
- [x] Saque (valida saldo suficiente)
- [x] Transferencia (atomica entre contas)
- [x] Consulta de saldo
- [x] Reset de dados
- [x] Interface web responsiva
- [x] Rotas protegidas no frontend
- [x] Documentacao Swagger interativa
- [x] Hot reload em desenvolvimento
- [x] TypeScript strict mode

## Regras de Negocio

- IDs de conta sao strings livres (ex: "100", "300")
- Contas sao criadas automaticamente no primeiro deposito
- Saques e transferencias validam existencia da conta origem
- Saques e transferencias validam saldo suficiente
- Transferencias criam conta destino se nao existir
- Valores monetarios com precisao de 2 casas decimais
