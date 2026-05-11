# Client Rules — React Frontend

> Carregado automaticamente pelo opencode ao mexer em `client/**`. Em conflito com AGENTS.md raiz, **estas rules vencem** por serem mais específicas. Conflitos com princípios fundamentais (segurança, tipo `any`) → sinalize ao usuário antes.

> **Tags de força:** `[MANDATORY]` = bug se violar. `[DEFAULT]` = padrão recomendado, desviar exige justificativa explícita. Sem tag = `[DEFAULT]`.

---

## TL;DR — Regras MANDATORY do escopo client

- **[MANDATORY]** Estrutura módulo: `modules/<feature>/{components,hooks,service,types,skeletons}/`. Nomes exatos. **NUNCA** `services/`, **NUNCA** `schemas/`, **NUNCA** `skeleton/` (singular).
- **[MANDATORY]** `skeletons/` em **todo** módulo, mesmo trivial. Não é invenção — é arquitetura.
- **[MANDATORY]** Camadas: Component → Hook (TanStack Query) → Service function → `api/axios`. **NUNCA** Component toca service direto. **NUNCA** Component ou Hook toca axios direto. **NUNCA** Page toca service.
- **[MANDATORY]** Server state via TanStack Query (`useQuery`/`useMutation`). **NUNCA** `useState+useEffect` para dados de API.
- **[MANDATORY]** Forms via React Hook Form + Zod via `zodResolver`. Schema Zod = single source of truth, exporta `schema + z.infer<>` do mesmo arquivo. **NUNCA** `useState` para form state. **NUNCA** interface duplicada ao lado do Zod type.
- **[MANDATORY]** Tailwind v4 only. Classes diretas em JSX. **NUNCA** `style={{}}`, **NUNCA** styled-components, **NUNCA** `.css`/`.scss`.
- **[MANDATORY]** `dark:` variants para bg, text, borders.
- **[MANDATORY]** Direção de import: `shared/` **NUNCA** importa de `modules/`. `modules/` **NUNCA** importa de `pages/`.
- **[MANDATORY]** Error state vem do hook (`isError`, `error`). **NUNCA** trate axios error em componente.
- **[MANDATORY]** Pages só compõem layout + chamam hooks. **NUNCA** business logic, **NUNCA** API call direta, **NUNCA** componente declarado dentro de page.
- **[DEFAULT]** Componente >150-200 linhas → split. Props com >5-6 campos → split.
- **[DEFAULT]** Componente usado em 2+ features → mover para `shared/components/`.

---

## Architecture Overview

### Tech Stack

- React 19, TypeScript, Tailwind CSS v4 (ONLY styling — via `@tailwindcss/vite`), React Router v7
- TanStack Query v5 (server state), Axios (HTTP client)
- React Hook Form v7 + Zod v4 (forms via `zodResolver`), React Hot Toast (notifications)
- Phosphor Icons (`@phosphor-icons/react`), Custom font: `Outfit`
- Dark mode: `darkMode: 'class'` (toggle in `shared/contexts/themeContext`)

### Project Structure

```
src/
  pages/          # Route-level — layout composition + module hooks only
  modules/        # Feature-based architecture
  shared/         # Global reusable code
  api/            # HTTP client config (axios instance + interceptors)
```

### Module Structure (MANDATORY — exact names)

```
modules/<feature>/
  components/     # Feature UI components
  hooks/          # TanStack Query hooks + logic
  service/        # API functions (ONE file per action) — NEVER `services/`
  types/          # TypeScript types + Zod schemas — NEVER `schemas/`
  skeletons/      # Loading skeletons (MANDATORY for every module)
  contexts/       # (optional) Feature-specific contexts
  config/         # (optional) Feature-specific constants
```

### Shared Structure

```
shared/
  components/     # Reusable UI (Input, Spinner, Toast, ToggleTheme, ErrorMessage...)
  hooks/          # Generic hooks (useNavigateTo, useFindMe...)
  contexts/       # Global contexts (userContext, themeContext)
  layouts/        # Layout components (Header, Sidebar, BottomNav, Content)
  services/       # Global services (findMeService, etc.)
  utils/          # Pure utility functions
```

Used em 2+ modules → `shared/`. Shared MUST NOT import from modules. No business logic em shared.

### API Layer (`src/api/`)

- `axios.ts` — configured axios instance (base URL, headers, defaults)
- `interceptors/` — axios interceptors (e.g. forbidden-interceptor.ts)
- Infrastructure only — no domain knowledge, no feature functions, no business logic

### Pages Layer

Pages orchestrate, NOT implement. Compose components from modules + call module hooks.
FORBIDDEN: business logic, direct API calls, creating components, complex state.

### Data Flow (STRICT)

```
UI (Component/Page) → Hook (TanStack Query) → Service function → api/axios
```

FORBIDDEN: Component→service ❌ | Component→axios ❌ | Hook→axios ❌ | Page→service ❌ | shared→modules ❌ | modules→pages ❌

### Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Component | `PascalCase.tsx` | `FeatureCard.tsx` |
| Hook | `use[Action][Entity].ts` | `useCreateFeature.ts` |
| Service | `[action][Entity]Service.ts` | `createFeatureService.ts` |
| Type | `[entity\|action].ts` | `feature.ts`, `createFeature.ts` |
| Skeleton | `[Feature]Skeleton.tsx` | `FeatureSkeleton.tsx` |

### State Strategy

| Type | Tool | Where |
|------|------|-------|
| Server data | TanStack Query (`useQuery`/`useMutation`) | `modules/<feature>/hooks/` |
| UI-only (modals, toggles) | `useState` | Component level |
| Global (auth, theme) | React Context | `shared/contexts/` |
| Forms | React Hook Form + Zod | hooks/ + types/ |

NEVER: `useState+useEffect` for server data | API data em `useState` | Context for feature data | mix server/client state.

### Styling (Tailwind v4 ONLY)

- Classes diretas em JSX — NO `style={{}}`, NO styled-components, NO .css/.scss
- Rounded: `rounded-xl`/`rounded-2xl` | Shadows: `shadow-sm`/`shadow-md`
- Borders: `border border-neutral-200 dark:border-neutral-700`
- Interactions: `hover:bg-neutral-100 transition-all duration-200`
- Always `dark:` variants for bg, text, borders
- Spacing: `p-4`, `p-6`, `gap-4`, `gap-6` — whitespace over clutter
- Typography: intentional sizes (`text-sm`→`text-xl`) + weights (`font-medium`→`font-bold`)
- Notifications: React Hot Toast
- Quality: modern, minimal, SaaS-level — never generic/template-looking

### Anti-Patterns (FORBIDDEN)

- Logic dentro de pages/JSX, God components, prop drilling
- Direct API usage outside service layer
- `services/` (must be `service/`), `schemas/` (must be `types/`), missing `skeletons/`
- `useState` for server data or forms
- Mixing styling approaches, inline styles
- Duplicated logic across modules
- Components coupled to specific data formats

Any violation → STOP → Refactor before continuing.

---

## Components

### Component Location

| Scenario | Location |
|----------|----------|
| Used em 1 feature | `modules/<feature>/components/` |
| Used em 2+ features | `shared/components/` |
| Page layout only | inline em `pages/` |

NEVER create components inside `pages/`. One component per file.

### Component Responsibility

- Single responsibility per component. Split at >150-200 lines
- Move ALL logic to hooks — keep components declarative
- Use props to receive data/actions. Strongly type all props (no `any`)
- If props become too complex → split component or move logic to hook

### File Structure

Simple: `ComponentName.tsx`
Complex: `ComponentName/index.tsx` + optional `types.ts`

### Skeleton Components (MANDATORY)

Every module MUST have `skeletons/` with loading skeletons for async components:

```typescript
// modules/feature/skeletons/FeatureSkeleton.tsx
const FeatureSkeleton = () => (
  <div className="animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800 p-4 flex flex-col gap-3">
    <div className="h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700" />
    <div className="h-3 w-full rounded bg-neutral-200 dark:bg-neutral-700" />
    <div className="h-3 w-4/5 rounded bg-neutral-200 dark:bg-neutral-700" />
  </div>
)
export default FeatureSkeleton
```

Match skeleton layout to real component. Use `animate-pulse`.

### Conditional Rendering

```typescript
if (isPending) return <FeatureSkeleton />
if (isError) return <ErrorMessage />
return <FeatureCard data={data} />
```

Keep conditions clean — no complex ternaries inline in JSX.

### Shared Components

Must be: generic (no feature data), configurable via props, stateless or UI-only state, independent from modules. NEVER import from modules. NEVER contain business logic.

### Styling

Tailwind classes diretas em JSX. No `style={{}}`, no styled-components, no CSS files.

---

## Forms (Zod + React Hook Form + zodResolver — MANDATORY)

### Schema + Type (em `modules/<feature>/types/`)

Zod schema IS the single source of truth. Export schema + inferred type from same file. NO `schemas/` folder. NO duplicate interfaces.

```typescript
// modules/auth/types/signIn.ts
import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

export type SignInData = z.infer<typeof signInSchema>
```

### Form Hook (em `modules/<feature>/hooks/`)

```typescript
// modules/auth/hooks/useSignIn.ts
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { signInSchema, type SignInData } from '../types/signIn'
import { signInService } from '../service/signInService'

export const useSignIn = () => {
  const form = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
  })

  const mutation = useMutation({
    mutationFn: (data: SignInData) => signInService(data),
  })

  const onSubmit = form.handleSubmit((data) => mutation.mutate(data))

  return { ...form, onSubmit, isPending: mutation.isPending }
}
```

### Form Component (em `modules/<feature>/components/`)

```typescript
// modules/auth/components/LoginForm.tsx
import { useSignIn } from '../hooks/useSignIn'

const LoginForm = () => {
  const { register, onSubmit, formState: { errors }, isPending } = useSignIn()

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <input {...register('email')} placeholder="E-mail" />
        {errors.email && <span>{errors.email.message}</span>}
      </div>
      <div>
        <input type="password" {...register('password')} placeholder="Senha" />
        {errors.password && <span>{errors.password.message}</span>}
      </div>
      <button type="submit" disabled={isPending}>
        {isPending ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}
```

### Form Rules

- Use `register` (uncontrolled) by default. `Controller` only for custom inputs without `ref` support
- NEVER: `useState` for form state | schema em component/hook | API calls em form components | duplicate interfaces alongside Zod types
- Reusable inputs (Input, PasswordInput) → `shared/components/`

### Form Data Flow

```
User Input → React Hook Form → Zod (zodResolver) → Hook onSubmit → TanStack mutation → Service → API
```

---

## Service Layer (`modules/<feature>/service/`)

One file per action. Folder name é `service/` (singular).

```typescript
// modules/feature/service/getFeatureService.ts
import { api } from '@/api/axios'
import type { Feature } from '../types/feature'

export const getFeatureService = async (id: string): Promise<Feature> => {
  const { data } = await api.get(`/feature/${id}`)
  return data
}
```

```typescript
// modules/feature/service/createFeatureService.ts
import { api } from '@/api/axios'
import type { CreateFeatureData } from '../types/createFeature'
import type { Feature } from '../types/feature'

export const createFeatureService = async (body: CreateFeatureData): Promise<Feature> => {
  const { data } = await api.post('/feature', body)
  return data
}
```

Rules:
- Import `api` from `@/api/axios`
- Pure functions — no hooks, no state, no UI logic, no toasts
- Return raw response data

---

## Hooks Layer (`modules/<feature>/hooks/`)

Naming: `use[Action][Entity].ts`

### Query (GET)

```typescript
import { useQuery } from '@tanstack/react-query'
import { getFeatureService } from '../service/getFeatureService'

export const useGetFeature = (id: string) => {
  return useQuery({
    queryKey: ['feature', id],
    queryFn: () => getFeatureService(id),
  })
}
```

### Mutation (POST/PATCH/DELETE)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFeatureService } from '../service/createFeatureService'
import type { CreateFeatureData } from '../types/createFeature'

export const useCreateFeature = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateFeatureData) => createFeatureService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature'] })
    },
  })
}
```

Rules:
- Call service functions, NEVER axios directly
- Invalidate queries on mutations via `queryClient.invalidateQueries()`
- Consistent queryKeys: `['feature']`, `['feature', id]`
- No UI rendering em hooks
- NEVER use `useState+useEffect` for server data — always TanStack Query

---

## Component Usage

```typescript
const { data, isPending, isError } = useGetFeature(id)

if (isPending) return <FeatureSkeleton />
if (isError) return <ErrorMessage />
return <FeatureCard data={data} />
```

- Use hooks to access data — NEVER call services or axios directly
- Let TanStack Query manage error state (`isError`, `error`)
- Access error state from hooks em components — don't handle API errors em components

### Error Handling

- Let TanStack Query manage error state
- Don't leak raw axios errors to UI
- Don't handle API errors inside components

### Scalability Rule

For each new feature:
1. Create service functions em `modules/<feature>/service/`
2. Create hooks using TanStack Query
3. Use hooks em UI components
4. NEVER skip layers
