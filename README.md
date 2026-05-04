# Strawby

Monorepo full-stack para rastreamento de refeições e nutrição. O usuário cadastra alimentos (ou usa o catálogo pré-populado com dados da tabela TACO) e registra suas refeições diárias, acompanhando calorias, proteínas, carboidratos e gorduras.

Arquitetura **pnpm workspaces** com dois pacotes independentes:

| Pacote | Stack |
|---|---|
| `server/` | NestJS · PostgreSQL · Prisma · JWT HTTP-only cookie |
| `client/` | React 19 · TypeScript · Tailwind CSS v4 · TanStack Query · Zod |

---

## Sumário

- [Estrutura do projeto](#estrutura-do-projeto)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Banco de dados](#banco-de-dados)
- [Rodando o projeto](#rodando-o-projeto)
  - [Com Docker (recomendado)](#com-docker-recomendado)
  - [Sem Docker (desenvolvimento local)](#sem-docker-desenvolvimento-local)
- [Endpoints da API](#endpoints-da-api)
  - [Auth](#auth)
  - [User](#user)
  - [Food (Alimentos)](#food-alimentos)
  - [Meal (Refeições)](#meal-refeições)
  - [Health](#health)
- [Segurança](#segurança)
- [Scripts disponíveis](#scripts-disponíveis)

---

## Estrutura do projeto

```
Strawby/
├── server/                          # API NestJS
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── common/
│   │   │   ├── config/cookie.config.ts
│   │   │   ├── dto/pagination.dto.ts
│   │   │   ├── filters/all-exceptions.filter.ts
│   │   │   ├── guards/auth/          # AuthGuard, OptionalAuthGuard, OwnershipGuard
│   │   │   ├── hash/                 # HashService (bcrypt)
│   │   │   └── types/
│   │   └── modules/
│   │       ├── auth/                 # Login e logout
│   │       ├── database/             # PrismaService
│   │       ├── food/                 # Catálogo de alimentos
│   │       ├── health/               # Health check
│   │       ├── meal/                 # Refeições e itens de refeição
│   │       └── user/                 # Usuários
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed-foods.ts             # Seed com tabela TACO de alimentos
│   │   └── taco.json                 # Dados nutricionais TACO
│   └── Dockerfile
│
├── client/                          # Frontend React
│   └── src/
│       ├── api/                      # Configuração axios + interceptors
│       ├── modules/                  # Módulos por feature
│       ├── shared/                   # Componentes, hooks e layouts globais
│       └── pages/
│
├── docker-compose.yml               # Sobe PostgreSQL + server
├── package.json                     # Workspace root
└── pnpm-workspace.yaml
```

---

## Tecnologias

### Backend (`server/`)

| Tecnologia | Uso |
|---|---|
| NestJS | Framework principal |
| PostgreSQL | Banco de dados |
| Prisma | ORM e migrations |
| JWT + @nestjs/jwt | Autenticação via cookie HTTP-only |
| bcrypt | Hash de senhas |
| Helmet | Headers de segurança HTTP |
| @nestjs/throttler | Rate limiting (100 req/min) |
| nestjs-pino | Logging estruturado |
| @nestjs/swagger | Documentação automática |
| class-validator | Validação de DTOs |

### Frontend (`client/`)

| Tecnologia | Uso |
|---|---|
| React 19 | UI |
| TypeScript | Tipagem |
| Tailwind CSS v4 | Estilização |
| TanStack Query v5 | Server state (cache, fetching, mutations) |
| React Hook Form v7 + Zod v4 | Formulários tipados com validação |
| Axios | HTTP client |
| React Hot Toast | Notificações |
| Phosphor Icons | Ícones |

---

## Pré-requisitos

**Com Docker:**
- Docker Desktop rodando

**Sem Docker:**
- Node.js >= 20
- pnpm
- PostgreSQL rodando localmente ou em nuvem

---

## Instalação

```bash
git clone <url-do-repositorio>
cd Strawby
pnpm install
```

---

## Variáveis de ambiente

Crie `server/.env` a partir do exemplo:

```bash
cp server/.env.example server/.env
```

Preencha as variáveis:

```env
NODE_ENV=development
PORT=3000

# PostgreSQL — com docker compose: postgresql://postgres:postgres@localhost:5432/appdb
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/appdb"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/appdb"

# CORS — URL do frontend
CORS_ORIGIN="http://localhost:5173"

# JWT — gere com: openssl rand -hex 64
JWT_SECRET=""
JWT_EXPIRES_IN=86400

# bcrypt
SALT_ROUNDS=10

# Swagger (rota /api-docs protegida por Basic Auth)
SWAGGER_USER=admin
SWAGGER_PASSWORD=admin
```

Para o frontend, crie `client/.env`:

```env
VITE_API_URL=http://localhost:3000
```

---

## Banco de dados

```bash
# Aplicar migrations
pnpm --filter server exec prisma migrate deploy

# Gerar Prisma Client
pnpm --filter server exec prisma generate

# Popular tabela de alimentos (dados TACO)
pnpm --filter server exec prisma db seed

# Abrir Prisma Studio
pnpm --filter server exec prisma studio
```

### Modelos

```
User      → id, name, email, password, createdAt, updatedAt
Food      → id, name, calories, protein, carbs, fat, createdAt, updatedAt
Meal      → id, name, date, userId, createdAt, updatedAt
MealItem  → id, quantity, mealId, foodId, createdAt, updatedAt
```

---

## Rodando o projeto

### Com Docker (recomendado)

O `docker-compose.yml` sobe **PostgreSQL + server** juntos. O banco já vem com healthcheck — o server só inicia depois que o Postgres estiver pronto.

```bash
# Sobe Postgres + API em background
docker compose up -d

# Acompanhar logs
docker compose logs -f

# Parar tudo
docker compose down
```

O frontend **não** é incluído no docker-compose. Rode separado:

```bash
pnpm --filter client dev
```

### Sem Docker (desenvolvimento local)

```bash
# Rodar tudo em paralelo (server + client)
pnpm dev

# Rodar separado
pnpm --filter server start:dev
pnpm --filter client dev
```

| Serviço | URL padrão |
|---|---|
| API | http://localhost:3000 |
| Frontend | http://localhost:5173 |
| Swagger | http://localhost:3000/api-docs |
| Prisma Studio | http://localhost:5555 |

---

## Endpoints da API

### Auth

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| `POST` | `/auth/login` | Não | Autentica e seta cookie `access_token` |
| `POST` | `/auth/logout` | Não | Limpa o cookie |

```json
// Body login
{ "email": "user@email.com", "password": "senha123" }
```

---

### User

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| `POST` | `/user` | Não | Cria usuário |
| `GET` | `/user/me` | Opcional | Retorna usuário logado ou `null` |
| `GET` | `/user/:id` | Não | Busca usuário por ID |
| `PATCH` | `/user/:id` | Obrigatória | Atualiza nome (somente o próprio) |
| `DELETE` | `/user/:id` | Obrigatória | Remove conta (somente o próprio) |

```json
// Body criar usuário
{ "name": "João Silva", "email": "joao@email.com", "password": "minhasenha123" }
```

---

### Food (Alimentos)

Catálogo de alimentos com dados nutricionais. Pré-populado com a tabela TACO via seed.

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| `GET` | `/food` | Não | Lista todos os alimentos |
| `GET` | `/food/search?search=nome` | Não | Busca alimento por nome |
| `GET` | `/food/:id` | Não | Busca alimento por ID |
| `POST` | `/food` | Obrigatória | Cria alimento customizado |
| `PATCH` | `/food/:id` | Obrigatória | Atualiza alimento |
| `DELETE` | `/food/:id` | Obrigatória | Remove alimento |

```json
// Body criar alimento
{
  "name": "Arroz cozido",
  "calories": 128,
  "protein": 2.5,
  "carbs": 28.1,
  "fat": 0.2
}
```

---

### Meal (Refeições)

Todas as rotas exigem autenticação. Os dados são isolados por usuário.

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/meal` | Cria uma refeição |
| `GET` | `/meal` | Lista todas as refeições do usuário |
| `GET` | `/meal/:id` | Busca uma refeição por ID |
| `PATCH` | `/meal/:id` | Atualiza nome ou data da refeição |
| `DELETE` | `/meal/:id` | Remove a refeição |
| `POST` | `/meal/:id/items` | Adiciona um alimento à refeição |
| `DELETE` | `/meal/:id/items/:itemId` | Remove um alimento da refeição |

```json
// Body criar refeição
{ "name": "Almoço", "date": "2026-04-15T12:00:00.000Z" }

// Body adicionar item
{ "foodId": "uuid-do-alimento", "quantity": 150 }
```

> `quantity` é em gramas. Os valores nutricionais são calculados proporcionalmente no retorno.

---

### Health

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Verifica se a API está no ar |

---

## Segurança

| Mecanismo | Descrição |
|---|---|
| Helmet | Headers HTTP de segurança |
| CORS | Origem restrita a `CORS_ORIGIN` |
| Rate Limiting | 100 req/min por IP |
| HTTP-only Cookie | JWT inacessível via JavaScript |
| bcrypt | Senhas nunca armazenadas em texto puro |
| ValidationPipe | Rejeita campos extras nos DTOs |
| Swagger protegido | Basic Auth na rota `/api-docs` |

---

## Scripts disponíveis

```bash
# Raiz do monorepo
pnpm dev                          # Server + client em paralelo
pnpm build                        # Build de tudo
pnpm lint                         # Lint de todos os pacotes
pnpm format                       # Prettier em todo o monorepo

# Filtrado por pacote
pnpm --filter server start:dev    # Server com hot reload
pnpm --filter server build        # Build do server
pnpm --filter server start:prod   # Produção
pnpm --filter client dev          # Frontend com hot reload
pnpm --filter client build        # Build do frontend

# Prisma (sempre via --filter server)
pnpm --filter server exec prisma migrate dev --name nome
pnpm --filter server exec prisma migrate deploy
pnpm --filter server exec prisma generate
pnpm --filter server exec prisma db seed
pnpm --filter server exec prisma studio
```
