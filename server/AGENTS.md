# Server Rules — NestJS Backend

> Carregado automaticamente ao mexer em `server/**`. Em conflito com AGENTS.md raiz, **estas rules vencem**.

---

## 0. TL;DR [MANDATORY]

- Estrutura flat: `modules/<feature>/<feature>.{controller,service,module}.ts` + `dto/`. **NUNCA** `controllers/` ou `services/` subfolder.
- Camadas: Controller → Service → PrismaService. **NUNCA** Controller toca Prisma. **NUNCA** Service toca req/res.
- DTOs com `class-validator` + `@nestjs/swagger` em **todos** os campos.
- Erros em **pt-BR** via `NotFoundException`, `ConflictException`, `UnauthorizedException`, `ForbiddenException`, `BadRequestException`, `InternalServerErrorException`.
- Toda Prisma op em `try/catch`. Rethrow NestJS exceptions, fallback `InternalServerErrorException`.
- `select` em Prisma para excluir campos sensíveis (password, tokens). **NUNCA** retornar entidade Prisma crua.
- Auth via cookie httpOnly. JWT payload só `{ sub, name }`. **NUNCA** localStorage, **NUNCA** Authorization header, **NUNCA** dados sensíveis no JWT.
- Senha via `HashService` (bcrypt). **NUNCA** bcrypt direto. **NUNCA** plain password em log/storage.
- Output via `type XPublic = Pick<X, ...>` no topo do service. **NUNCA** retornar `User` cru.
- `OwnershipGuard` sempre depois de `AuthGuard`: `@UseGuards(AuthGuard, OwnershipGuard)`.
- Controllers 1-5 linhas por método. Services até ~80 linhas por método.

---

## 1. Estrutura

```
src/
  modules/<feature>/
    <feature>.controller.ts
    <feature>.service.ts
    <feature>.module.ts
    dto/
      create-<feature>.dto.ts
      update-<feature>.dto.ts
  modules/database/
    database.module.ts    # exporta PrismaService
    prisma.service.ts     # extends PrismaClient
  common/
    config/               # cookie.config.ts
    guards/auth/          # BaseJwtGuard, AuthGuard, OptionalAuthGuard, OwnershipGuard
    hash/                 # HashModule + HashService
    types/                # req-types, query-types
    dto/                  # shared DTOs (pagination)
```

NO `src/prisma/`. NO `controllers/` ou `services/` subfolders. NO `entities/` folder.

## 2. Request Flow

```
Controller → Service → PrismaService → Database
```

FORBIDDEN: Controller→PrismaService | Controller→business logic | Service→HTTP logic | PrismaService→business logic

## 3. Controllers

- Transport layer only. Receive DTO → call service → return response.
- Use DTOs for ALL inputs via `@Body()`, `@Param()`, `@Query()`
- Use `@UseGuards()` for protected routes
- Use `@Req()` only to read `req.user` (set by guards)
- Cookie handling: `@Res({ passthrough: true })` + `cookieConfig` importado
- RESTful naming: `create`, `findAll`, `findOne`, `update`, `remove`
- FORBIDDEN: business logic, PrismaService access, complex data transformation

## 4. DTOs

- Create: `@ApiProperty` + class-validator (`@IsNotEmpty` sempre com type validator)
- Update: `@ApiPropertyOptional` + `@IsOptional`
- Naming: `CreateUserDto`, `UpdateUserDto` — NEVER generic
- Global pipe: `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`
- NO business logic. NOT used as output models.

## 5. Services

- ALL business logic. Orchestrate, enforce rules, handle errors.
- Output typing: `type XPublic = Pick<X, 'field1' | 'field2'>` no topo do file.
- Prisma `select` para match do output type. NEVER return full records com sensíveis.
- Error messages em pt-BR. NEVER expor internal details (SQL, stack traces, Prisma messages).
- Cross-module: inject other services (never their PrismaService).

### Error Handling

```typescript
try {
  return await this.prisma.user.create({ ... })
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    throw new ConflictException('E-mail já cadastrado')
  }
  throw new InternalServerErrorException('Erro ao criar usuário')
}
```

Rethrow pattern (MANDATORY): NestJS exceptions thrown inside `try` MUST be rethrown in `catch`.

| Code | Meaning | Exception |
|------|---------|-----------|
| `P2002` | Unique constraint violation | `ConflictException` |
| `P2025` | Record not found (update/delete) | `NotFoundException` |

## 6. Auth

- JWT-based, stateless. Token in HTTP-only cookies. NO passport/passport-jwt.
- Flow: `POST /auth/login` → Controller recebe SignInDto → AuthService valida → gera JWT → Controller seta cookie.
- AuthService: validate credentials, generate JWT, return `{ access_token }`. Does NOT set cookies.
- AuthController: seta/limpa cookie via `@Res({ passthrough: true })`.
- HashService (`common/hash/`): `hashPassword()` e `comparePassword()` via bcrypt.
- JWT payload: `{ sub: user.id, name: user.name }`. NEVER incluir dados sensíveis.
- Cookie config importado de `src/common/config/cookie.config.ts`.

## 7. Guards

```typescript
@UseGuards(AuthGuard)                    // requires authenticated user
@UseGuards(OptionalAuthGuard)            // works with or without auth
@UseGuards(AuthGuard, OwnershipGuard)    // authenticated + resource owner
```

- `AuthGuard`: reads `access_token` from cookies. Throws `UnauthorizedException`.
- `OptionalAuthGuard`: never throws. Sets `request.user = null`.
- `OwnershipGuard`: compara `request.user.sub` com `request.params.id`. Throws `ForbiddenException`. MUST always be used WITH `AuthGuard`.
- NEVER implement auth logic manually. NEVER create new JWT guards from scratch — extend `BaseJwtGuard`.

## 8. Security

- Validate ALL inputs via DTOs (`whitelist`, `forbidNonWhitelisted`)
- Prisma prevents SQL injection. Always exclude sensitive fields via `select`
- NEVER store/log plain passwords
- NEVER expose internal data structures
- Log important actions. NEVER log sensitive data
