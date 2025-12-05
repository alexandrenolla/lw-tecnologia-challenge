# Contexto do Projeto - API Bancária

## Objetivo
API REST + Frontend React para simular operações bancárias com autenticação JWT.

## Stack Tecnológico
- **Backend**: Node.js 24, TypeScript (strict), Express, TypeORM, PostgreSQL
- **Frontend**: React 18, TypeScript (strict), Vite, React Router
- **Infra**: Docker Compose

## Convenções de Código

### Geral
- TypeScript strict mode em tudo
- Sem `any` types (usar `unknown` se necessário)
- Preferir `const` sobre `let`, nunca `var`
- Funções: arrow functions para callbacks, named functions para exports
- Imports: ordem alfabética, agrupados (externos → internos → types)
- Naming: camelCase para variáveis/funções, PascalCase para classes/components
- Comentários: apenas quando lógica complexa, código deve ser auto-explicativo

### Backend (Node.js + Express)
- Arquitetura em camadas: Routes → Controllers → Services → Entities
- Controllers: apenas validação e formatação de resposta
- Services: lógica de negócio pura
- Entities: TypeORM decorators, sem lógica
- Error handling: classe AppError customizada, middleware centralizado
- Async: sempre async/await, nunca callbacks ou Promises diretos
- Status codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)
- Response format: sempre JSON, consistente entre endpoints

### TypeORM
- synchronize: true (sem migrations)
- Entities com decorators claros
- UUIDs para primary keys
- Decimal para valores monetários (precision: 10, scale: 2)
- Timestamps: CreateDateColumn, UpdateDateColumn
- Relacionamentos: apenas quando necessário

### Frontend (React)
- Functional components apenas
- Hooks para estado e side effects
- Context API para estado global (auth)
- CSS Modules ou CSS puro (sem libs externas)
- Validação client-side antes de API call
- Loading states explícitos
- Error handling com mensagens amigáveis
- Responsive design (mobile-first)

### Segurança
- Senhas: bcrypt com salt rounds 10
- JWT: expiração 24h, Bearer token
- Validação de inputs em todas camadas
- CORS configurado
- Variáveis sensíveis via .env

### Docker
- Imagens Alpine (menor tamanho)
- Hot reload em desenvolvimento
- Volumes para persistência
- Health checks apenas se necessário
- Variáveis de ambiente explícitas

## Padrões de Response

### Sucesso
```json
// Balance
{ "balance": 20 }

// Deposit/Withdraw
{ "destination": { "id": "100", "balance": 10 } }

// Transfer
{
  "origin": { "id": "100", "balance": 0 },
  "destination": { "id": "300", "balance": 15 }
}

// Login
{ "token": "jwt_token_here" }
```

### Erro
```json
{ "error": "Error message" }
```

## Estrutura de Arquivos

### Backend
/apps/api/src
/config       - database.ts, env.ts
/entities     - User.ts, Account.ts, Transaction.ts
/middlewares  - auth.ts, errorHandler.ts
/controllers  - authController.ts, accountController.ts
/services     - authService.ts, accountService.ts
/routes       - index.ts
/types        - (quando necessário)
server.ts

### Frontend
/apps/web/src
/components   - Reutilizáveis
/pages        - Login.tsx, Dashboard.tsx
/services     - api.ts, authService.ts
/contexts     - AuthContext.tsx
/types        - types.ts
App.tsx
main.tsx

## Princípios
1. **Simplicidade** > Complexidade
2. **Legibilidade** > Cleverness
3. **Consistência** > Preferências pessoais
4. **Boas práticas** > Over-engineering
5. **Funcionalidade** > Perfeição prematura

## Regras de Negócio

### Contas
- IDs são strings livres (ex: "100", "300")
- Saldo inicial pode ser zero ou positivo
- Contas criadas automaticamente no primeiro depósito
- Não existe deleção de contas

### Operações
- Depósito: cria conta se não existe, incrementa saldo
- Saque: valida existência e saldo suficiente
- Transferência: valida origem, cria destino se necessário, atômico
- Reset: limpa todas contas e transações

### Autenticação
- Usuário padrão: admin/admin (seed automático)
- Token JWT válido por 24h
- Todas operações bancárias requerem auth
- Login não requer auth (óbvio)
