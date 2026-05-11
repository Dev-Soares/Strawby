# Client Rules — React Frontend

> Carregado automaticamente ao mexer em `client/**`. Em conflito com AGENTS.md raiz, **estas rules vencem**.

---

## 0. TL;DR [MANDATORY]

- Estrutura módulo: `modules/<feature>/{components,hooks,service,types,skeletons}/`. Nomes exatos. **NUNCA** `services/`, **NUNCA** `schemas/`, **NUNCA** `skeleton/` (singular).
- `skeletons/` em **todo** módulo, mesmo trivial.
- Camadas: Component → Hook (TanStack Query) → Service function → `api/axios`. **NUNCA** Component toca service direto. **NUNCA** Component ou Hook toca axios direto. **NUNCA** Page toca service.
- Server state via TanStack Query (`useQuery`/`useMutation`). **NUNCA** `useState+useEffect` para dados de API.
- Forms via React Hook Form + Zod via `zodResolver`. Schema Zod = single source of truth, exporta `schema + z.infer<>` do mesmo arquivo. **NUNCA** `useState` para form state. **NUNCA** interface duplicada ao lado do Zod type.
- Tailwind v4 only. Classes diretas em JSX. **NUNCA** `style={{}}`, **NUNCA** styled-components, **NUNCA** `.css`/`.scss`.
- `dark:` variants para bg, text, borders.
- Direção de import: `shared/` **NUNCA** importa de `modules/`. `modules/` **NUNCA** importa de `pages/`.
- Error state vem do hook (`isError`, `error`). **NUNCA** trate axios error em componente.
- Pages só compõem layout + chamam hooks. **NUNCA** business logic, **NUNCA** API call direta, **NUNCA** componente declarado dentro de page.
- Componente >150-200 linhas → split. Props com >5-6 campos → split.
- Componente usado em 2+ features → mover para `shared/components/`.

---

## 1. Estrutura

```
src/
  pages/          # Route-level — layout composition + module hooks only
  modules/<feature>/
    components/     # Feature UI components
    hooks/          # TanStack Query hooks
    service/        # API functions (singular — NOT services/)
    types/          # TypeScript types + Zod schemas (NOT schemas/)
    skeletons/      # Loading skeletons (MANDATORY)
    contexts/       # (optional)
    config/         # (optional)
  shared/
    components/     # Reusable UI
    hooks/          # Generic hooks
    contexts/       # Global contexts
    layouts/        # Layout components
    services/       # Global services
    utils/          # Pure utility functions
  api/
    axios.ts              # Configured axios instance
    interceptors/         # Axios interceptors
```

Shared MUST NOT import from modules. No business logic em shared.

## 2. Data Flow

```
UI (Component/Page) → Hook (TanStack Query) → Service function → api/axios
```

FORBIDDEN: Component→service | Component→axios | Hook→axios | Page→service | shared→modules | modules→pages

## 3. Forms (Zod + React Hook Form + zodResolver)

### Schema + Type

```typescript
// modules/auth/types/signIn.ts
import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

export type SignInData = z.infer<typeof signInSchema>
```

### Hook

```typescript
// modules/auth/hooks/useSignIn.ts
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { signInSchema, type SignInData } from '../types/signIn'
import { signInService } from '../service/signInService'

export const useSignIn = () => {
  const form = useForm<SignInData>({ resolver: zodResolver(signInSchema) })
  const mutation = useMutation({ mutationFn: signInService })
  const onSubmit = form.handleSubmit((data) => mutation.mutate(data))
  return { ...form, onSubmit, isPending: mutation.isPending }
}
```

### Component

```typescript
// modules/auth/components/LoginForm.tsx
import { useSignIn } from '../hooks/useSignIn'

const LoginForm = () => {
  const { register, onSubmit, formState: { errors }, isPending } = useSignIn()
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input {...register('email')} placeholder="E-mail" />
      {errors.email && <span>{errors.email.message}</span>}
      <input type="password" {...register('password')} placeholder="Senha" />
      {errors.password && <span>{errors.password.message}</span>}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}
```

- Use `register` (uncontrolled) by default. `Controller` only for custom inputs without `ref` support
- NEVER: `useState` for form state | schema em component/hook | API calls em form components | duplicate interfaces alongside Zod types
- Reusable inputs (Input, PasswordInput) → `shared/components/`

## 4. Service Layer (`modules/<feature>/service/`)

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

- Import `api` from `@/api/axios`
- Pure functions — no hooks, no state, no UI logic, no toasts
- Return raw response data

## 5. Hooks Layer (`modules/<feature>/hooks/`)

Naming: `use[Action][Entity].ts`

### Query (GET)

```typescript
import { useQuery } from '@tanstack/react-query'
import { getFeatureService } from '../service/getFeatureService'

export const useGetFeature = (id: string) => {
  return useQuery({ queryKey: ['feature', id], queryFn: () => getFeatureService(id) })
}
```

### Mutation (POST/PATCH/DELETE)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFeatureService } from '../service/createFeatureService'

export const useCreateFeature = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createFeatureService,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feature'] }),
  })
}
```

- Call service functions, NEVER axios directly
- Invalidate queries on mutations via `queryClient.invalidateQueries()`
- Consistent queryKeys: `['feature']`, `['feature', id]`

## 6. Component Usage

```typescript
const { data, isPending, isError } = useGetFeature(id)

if (isPending) return <FeatureSkeleton />
if (isError) return <ErrorMessage />
return <FeatureCard data={data} />
```

- Use hooks to access data — NEVER call services or axios directly
- Let TanStack Query manage error state (`isError`, `error`)
- Access error state from hooks em components — don't handle API errors em components

## 7. Skeletons

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

## 8. Styling (Tailwind v4 ONLY)

- Classes diretas em JSX — NO `style={{}}`, NO styled-components, NO .css/.scss
- Rounded: `rounded-xl`/`rounded-2xl` | Shadows: `shadow-sm`/`shadow-md`
- Borders: `border border-neutral-200 dark:border-neutral-700`
- Interactions: `hover:bg-neutral-100 transition-all duration-200`
- Always `dark:` variants for bg, text, borders
- Spacing: `p-4`, `p-6`, `gap-4`, `gap-6`
- Typography: intentional sizes (`text-sm`→`text-xl`) + weights (`font-medium`→`font-bold`)
- Notifications: React Hot Toast
- Quality: modern, minimal, SaaS-level

## 9. Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Component | `PascalCase.tsx` | `FeatureCard.tsx` |
| Hook | `use[Action][Entity].ts` | `useCreateFeature.ts` |
| Service | `[action][Entity]Service.ts` | `createFeatureService.ts` |
| Type | `[entity\|action].ts` | `feature.ts`, `createFeature.ts` |
| Skeleton | `[Feature]Skeleton.tsx` | `FeatureSkeleton.tsx` |

## 10. Anti-Patterns (FORBIDDEN)

- Logic dentro de pages/JSX, God components, prop drilling
- Direct API usage outside service layer
- `services/` (must be `service/`), `schemas/` (must be `types/`), missing `skeletons/`
- `useState` for server data or forms
- Mixing styling approaches, inline styles
- Duplicated logic across modules
- Components coupled to specific data formats

Any violation → STOP → Refactor before continuing.
