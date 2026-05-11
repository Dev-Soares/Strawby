# AGENTS.md — Normativo Global

> server|client/AGENTS.md > este arquivo > preferência do agent

---

## 0. TL;DR — Antes de Responder

1. Identifique escopo (`server/**`, `client/**`, ambos, neutro)
2. Confirme `<scope>/AGENTS.md` carregado; se não, leia
3. Inspecione 1-2 arquivos vizinhos antes de gerar código

## 1. Checklist Pré-Entrega [MANDATORY]

- [ ] Sem `any`; `unknown` + narrow ou Zod na fronteira
- [ ] Input externo validado por schema antes da lógica
- [ ] Sem secret/token/credencial em código, log, ou response; `.env` no `.gitignore`
- [ ] Camadas respeitadas:
  - server: Controller → Service → PrismaService. **Nunca** Controller→Prisma
  - client: Component → Hook (TanStack Query) → Service → axios. **Nunca** Component→axios
- [ ] Mensagens de erro do backend em **pt-BR**; strings de UI em pt-BR
- [ ] Frontend: zero `style={{}}`, zero CSS files, zero styled-components. **Tailwind v4 only**
- [ ] Backend: erros via NestJS exceptions (`NotFoundException`, etc), nunca string genérica
- [ ] Sem comentário que explique **o que** o código faz; comentário só para **por que** não-óbvio
- [ ] Sem feature/validação/log que o usuário não pediu
- [ ] Consistência com vizinhos > elegância abstrata

## 2. Decisões Fixas (Não Reabrir)

- Skeletons **MANDATORY** em todo módulo client, mesmo trivial
- Error messages em **pt-BR** no backend
- Cookie **httpOnly** para auth; nunca localStorage, nunca `Authorization` header no client
- Service layer **obrigatório** no client mesmo em GET trivial
- DTOs com **class-validator + @nestjs/swagger** em todos os campos
- Estrutura **flat no server** (`<feature>.controller.ts`), **hierárquica no client** (`modules/<feature>/components/`)

## 3. Hierarquia de Prioridades

1. Correção
2. Segurança
3. Legibilidade
4. Consistência com o projeto
5. Performance (só com medição)
6. Brevidade

## 4. TypeScript — Regras Com Exemplos

### 4.1 Tipagem

Nunca `any`. Use `unknown` + narrow ou Zod na fronteira.

```typescript
// RUIM
function parse(input: any) { return input.data.value }

// BOM
function parse(input: unknown): string {
  const Schema = z.object({ data: z.object({ value: z.string() }) })
  return Schema.parse(input).data.value
}
```

### 4.2 Discriminated Unions

```typescript
// RUIM — estados impossíveis representáveis
interface RequestState {
  loading: boolean
  data: User | null
  error: Error | null
}

// BOM — estados impossíveis inalcançáveis
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: Error }
```

### 4.3 Imutabilidade

```typescript
// RUIM
function addTax(order: Order) {
  order.total = order.total * 1.1
  return order
}

// BOM
function addTax(order: Order): Order {
  return { ...order, total: order.total * 1.1 }
}
```

### 4.4 `interface` vs `type`

- `interface` para shapes de objetos que podem ser estendidos por consumidores (APIs públicas de pacote)
- `type` para tudo o mais — unions, tuples, mapped types, aliases, primitivos compostos

## 5. Tratamento de Erros

### 5.1 Princípios

1. **Falhe cedo, falhe alto.** Validação na fronteira (input externo, parsing, deserialização). Internamente, confie no tipo.
2. **Não engula erro.** `catch` vazio ou `catch` que apenas loga e continua é bug latente.
3. **Erro tipado quando o caller pode reagir.** Erro genérico quando só serve para crash report.
4. **Try/catch é último recurso.** Se você pode validar antes em vez de capturar depois, valide antes.

### 5.2 Result type vs throw

```typescript
// Throw quando: erro é excepcional, caller não tem ação razoável
async function loadConfig(): Promise<Config> {
  const raw = await fs.readFile('config.json', 'utf-8')
  return ConfigSchema.parse(JSON.parse(raw))
}

// Result type quando: erro é caso de uso esperado
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E }
```

### 5.3 Validação em Boundary

Todo input externo passa por schema validator antes de tocar a lógica.

```typescript
// RUIM
app.post('/users', (req, res) => {
  const user = await db.user.create({ data: req.body })
  res.json(user)
})

// BOM
const CreateUser = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
})

app.post('/users', async (req, res) => {
  const parsed = CreateUser.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() })
  const user = await db.user.create({ data: parsed.data })
  res.json(user)
})
```

### 5.4 Não logue e re-lance

```typescript
// RUIM — duplo tratamento, log poluído
try {
  await op()
} catch (e) {
  console.error('Op failed:', e)
  throw e
}

// BOM — decida em UM lugar
try {
  await op()
} catch (e) {
  logger.error({ err: e, op: 'op' }, 'op failed')
  throw new OperationError('op failed', { cause: e })
}
```

## 6. Exemplos Few-Shot

### 6.1 Separação de Cálculo e Efeito

```typescript
// RUIM — efeito colateral oculto, intestável sem mock
function processOrder(order: Order) {
  const total = order.items.reduce((s, i) => s + i.price, 0)
  db.order.update({ where: { id: order.id }, data: { total } })
  emailService.send(order.customerEmail, 'Order processed')
  return total
}

// BOM — separação de cálculo e efeito
function calcTotal(items: Item[]): number {
  return items.reduce((s, i) => s + i.price, 0)
}

async function processOrder(order: Order) {
  const total = calcTotal(order.items)
  await db.order.update({ where: { id: order.id }, data: { total } })
  await emailService.send(order.customerEmail, 'Order processed')
  return total
}
```

### 6.2 Early Return vs Aninhamento

```typescript
// RUIM
function getDiscount(user: User) {
  if (user.active) {
    if (user.subscription) {
      if (user.subscription.tier === 'pro') { return 0.2 }
      else { return 0.1 }
    } else { return 0 }
  } else { return 0 }
}

// BOM
function getDiscount(user: User): number {
  if (!user.active) return 0
  if (!user.subscription) return 0
  if (user.subscription.tier === 'pro') return 0.2
  return 0.1
}
```

## 7. Formato de Resposta

- Sem saudação/concordância performática ("Claro", "Certo", "Perfeito")
- Sem emoji, sem entusiasmo textual, sem "espero que ajude!"
- Pergunta simples → resposta direta, 1-3 frases
- Tarefa de implementação: diagnóstico breve (1-2 frases) → código → notas de trade-off (se relevante)
- Code blocks com linguagem especificada
- Referências: `caminho/arquivo.ts:linha`

## 8. Contexto do Projeto

Monorepo pnpm workspaces. Backend NestJS + Frontend React.

```
server/     # NestJS API — src/modules/, src/common/, prisma/
client/     # React + Vite — src/pages/, src/modules/, src/shared/, src/api/
```

Comandos:
- `pnpm dev` — tudo em paralelo
- `pnpm --filter server start:dev` — backend
- `pnpm --filter client dev` — frontend
- `docker compose up -d` — PostgreSQL
- `pnpm --filter server exec prisma migrate dev` — migrations

## 9. Compatibilidade Dual-CLI

| Arquivo | Consumido por |
|---|---|
| `AGENTS.md` (raiz) | opencode |
| `server/AGENTS.md`, `client/AGENTS.md` | opencode (auto-load por traversal) |
| `.claude/rules/` | Claude Code |

Divergência entre as duas fontes é bug. Mantenha `.claude/rules/` manualmente se usar Claude Code.
