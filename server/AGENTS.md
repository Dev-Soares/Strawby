# Server Rules — NestJS Backend

> Carregado automaticamente pelo opencode ao mexer em `server/**`. Em conflito com AGENTS.md raiz, **estas rules vencem** por serem mais específicas. Conflitos com princípios fundamentais (segurança, tipo `any`) → sinalize ao usuário antes.

> **Tags de força:** `[MANDATORY]` = bug se violar. `[DEFAULT]` = padrão recomendado, desviar exige justificativa explícita. Sem tag = `[DEFAULT]`.

---

## TL;DR — Regras MANDATORY do escopo server

- **[MANDATORY]** Estrutura flat: `modules/<feature>/<feature>.{controller,service,module}.ts` + `dto/`. **NUNCA** `controllers/` ou `services/` subfolder.
- **[MANDATORY]** Camadas: Controller → Service → PrismaService. **NUNCA** Controller toca Prisma. **NUNCA** Service toca req/res.
- **[MANDATORY]** DTOs com `class-validator` + `@nestjs/swagger` em **todos** os campos.
- **[MANDATORY]** Erros em **pt-BR** via `NotFoundException`, `ConflictException`, `UnauthorizedException`, `ForbiddenException`, `BadRequestException`, `InternalServerErrorException`.
- **[MANDATORY]** Toda Prisma op em `try/catch`. Rethrow NestJS exceptions, fallback `InternalServerErrorException`.
- **[MANDATORY]** `select` em Prisma para excluir campos sensíveis (password, tokens). **NUNCA** retornar entidade Prisma crua.
- **[MANDATORY]** Auth via cookie httpOnly. JWT payload só `{ sub, name }`. **NUNCA** localStorage, **NUNCA** Authorization header, **NUNCA** dados sensíveis no JWT.
- **[MANDATORY]** Senha via `HashService` (bcrypt). **NUNCA** bcrypt direto. **NUNCA** plain password em log/storage.
- **[MANDATORY]** Output via `type XPublic = Pick<X, ...>` no topo do service. **NUNCA** retornar `User` cru.
- **[MANDATORY]** `OwnershipGuard` sempre depois de `AuthGuard`: `@UseGuards(AuthGuard, OwnershipGuard)`.
- **[DEFAULT]** Controllers 1-5 linhas por método. Services até ~80 linhas por método.

---

## Architecture Overview

### Tech Stack

- NestJS, TypeScript, Prisma (ORM via `PrismaService` em `DatabaseModule`)
- JWT (auth via HTTP-only cookies), class-validator + `@nestjs/swagger` (DTOs)
- bcrypt via `HashService` (password hashing), nestjs-pino (logging), helmet + ThrottlerModule (security)

### Project Structure

```
src/
  modules/            # Feature-based modules (auth, user, database, health...)
  common/
    config/           # App-wide config (cookie.config.ts)
    filters/          # Global exception filters
    guards/auth/      # BaseJwtGuard, AuthGuard, OptionalAuthGuard, OwnershipGuard, AuthGuardModule
    hash/             # HashModule + HashService (bcrypt)
    types/            # Shared types (req-types, query-types)
    dto/              # Shared DTOs (e.g. pagination)
```

### Module Structure (FLAT FILES — MANDATORY)

```
modules/<feature>/
  <feature>.controller.ts   # HTTP layer (thin — 1-5 lines per method)
  <feature>.service.ts      # ALL business logic
  <feature>.module.ts       # NestJS module
  dto/                      # Input validation (class-validator + @nestjs/swagger)
    create-<feature>.dto.ts
    update-<feature>.dto.ts
```

NO `controllers/` ou `services/` subfolders. NO `entities/` folder — output types são inline `Pick<>` em services.

### Database Module

```
modules/database/
  database.module.ts        # Exports PrismaService
  prisma.service.ts         # PrismaService extends PrismaClient, implements OnModuleInit
```

NÃO existe pasta `src/prisma/`. Feature modules importam `DatabaseModule` para injetar `PrismaService`.

### Request Flow (MANDATORY)

```
Controller → Service → PrismaService → Database
```

FORBIDDEN: Controller→PrismaService ❌ | Controller→business logic ❌ | Service→HTTP logic ❌ | PrismaService→business logic ❌

### Layer Responsibilities

**Controllers**: HTTP transport only. Receive DTOs, call services, return responses. Use `@UseGuards()` for protection. Keep methods 1-5 lines. No business logic, no PrismaService access, no data transformation.

**Services**: ALL business logic. Orchestrate operations, enforce rules, handle errors via try/catch + NestJS exceptions. Use `Pick<>` for output typing + Prisma `select`. Error messages em pt-BR.

**PrismaService**: Data access only. Used ONLY inside services. No business logic.

**DTOs**: Input contracts. Validate with class-validator, document with `@nestjs/swagger`. Not used as output models.

### Development Rules

- Controllers thin, services focused and explicit
- Validate ALL input via DTOs
- Error messages em Portuguese (pt-BR)
- NEVER return sensitive fields (password, tokens) in responses
- NEVER bypass service layer or access DB in controllers
- Cross-module communication via injecting other module's service (never their PrismaService)

Any violation → STOP → Refactor before continuing.

---

## Controllers

### Location

`modules/<feature>/<feature>.controller.ts` — flat file at module root, NOT in `controllers/` subfolder.

### Pattern

Cada method: receive DTO → call service → return response. Max 1-5 lines.

```typescript
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto)
  }

  @UseGuards(AuthGuard, OwnershipGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id)
  }

  @UseGuards(AuthGuard, OwnershipGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto)
  }

  @UseGuards(AuthGuard, OwnershipGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id)
  }
}
```

### Rules

- Use DTOs for ALL inputs via `@Body()`, `@Param()`, `@Query()`
- Use `@UseGuards()` for protected routes
- Use `@Req()` only to read `req.user` (set by guards) — never parse tokens manually
- RESTful naming: `create`, `findAll`, `findOne`, `update`, `remove` (or semantic: `findMe`, `signIn`, `logout`)
- FORBIDDEN: business logic, PrismaService access, complex data transformation, manual validation

### Cookie Handling (Auth Routes Only)

Use `@Res({ passthrough: true })` — `passthrough: true` is mandatory (keeps NestJS interceptors working):

```typescript
@Post('login')
@HttpCode(HttpStatus.OK)
async signIn(@Body() dto: SignInDto, @Res({ passthrough: true }) res: Response) {
  const result = await this.authService.signIn(dto.email, dto.password)
  res.cookie('access_token', result.access_token, cookieConfig)
  return { message: 'Sign In successful' }
}
```

Import `cookieConfig` from `src/common/config/cookie.config`. NEVER hardcode cookie options.

### Guard Usage

```typescript
@UseGuards(AuthGuard)                    // requires authenticated user
@UseGuards(OptionalAuthGuard)            // works with or without auth
@UseGuards(AuthGuard, OwnershipGuard)    // authenticated + resource owner
```

Access user: `@Req() req: AuthenticatedRequest` ou `OptionalAuthRequest` (from `src/common/types/req-types`).

---

## DTOs

### Location

`modules/<feature>/dto/create-<feature>.dto.ts`, `update-<feature>.dto.ts`

### Validation (MANDATORY)

Every field MUST have both class-validator AND `@nestjs/swagger` decorators. `@IsNotEmpty()` always combined with type validator.

#### Create DTO

```typescript
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({ example: 'user@email.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ example: 'strongPassword123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  password: string

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string
}
```

#### Update DTO (all optional)

```typescript
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator'

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string

  @ApiPropertyOptional({ example: 'new@email.com' })
  @IsEmail()
  @IsOptional()
  email?: string
}
```

### Naming

`CreateUserDto`, `UpdateUserDto`, `SignInDto`, `PaginationDto` — NEVER generic names like `UserData`, `Payload`.

### Global Validation Pipe (MANDATORY)

`whitelist: true`, `forbidNonWhitelisted: true`, `transform: true` — no manual validation in controllers/services.

### DTO Rules

- No business logic in DTOs. DTOs are NOT output models
- Always include `example` in `@ApiProperty`/`@ApiPropertyOptional`
- Common validators: `@IsString`, `@IsEmail`, `@IsNumber`, `@IsBoolean`, `@IsNotEmpty`, `@IsOptional`, `@MinLength`, `@MaxLength`

---

## Services

### Location

`modules/<feature>/<feature>.service.ts` — flat file at module root, NOT in `services/` subfolder.

### Output Typing (inline Pick — no entity files)

```typescript
import { User } from '@prisma/client'

type UserPublic = Pick<User, 'id' | 'name' | 'email'>
```

Define `type XPublic = Pick<X, ...>` no topo do service file. Use Prisma `select` to match. NEVER return full records with sensitive fields.

### Service Method Pattern

```typescript
async methodName(input): Promise<OutputType> {
  // 1. Prepare data (e.g. hash password)
  // 2. Prisma operation (wrapped in try/catch)
  // 3. Business logic (check results, compare values)
  // 4. Handle edge cases (throw NestJS exceptions)
  // 5. Return typed result
}
```

### Complete Example

```typescript
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../database/prisma.service'
import { Prisma, User } from '@prisma/client'
import { CreateUserDto } from './dto/create-user.dto'

type UserPublic = Pick<User, 'id' | 'name' | 'email'>

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<UserPublic> {
    const hashedPassword = await this.hashService.hashPassword(data.password)
    try {
      return await this.prisma.user.create({
        data: { name: data.name, email: data.email, password: hashedPassword },
        select: { id: true, name: true, email: true },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('E-mail já cadastrado')
      }
      throw new InternalServerErrorException('Erro ao criar usuário')
    }
  }

  async findOne(id: string): Promise<UserPublic> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: { id: true, name: true, email: true },
      })
      if (!user) throw new NotFoundException('Usuário não encontrado')
      return user
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException('Erro ao buscar usuário')
    }
  }
}
```

### Error Handling (MANDATORY)

All Prisma operations wrapped in `try/catch`. Handle specific Prisma codes, então fall back to `InternalServerErrorException`.

#### Rethrow Pattern (MANDATORY)

NestJS exceptions thrown inside `try` MUST be rethrown in `catch`:

```typescript
} catch (error) {
  if (error instanceof NotFoundException) throw error
  if (error instanceof UnauthorizedException) throw error
  throw new InternalServerErrorException('Erro ao buscar usuário')
}
```

#### Prisma Error Codes

| Code | Meaning | Exception |
|------|---------|-----------|
| `P2002` | Unique constraint violation | `ConflictException` |
| `P2025` | Record not found (update/delete) | `NotFoundException` |

#### Standard NestJS Exceptions

`NotFoundException`, `BadRequestException`, `UnauthorizedException`, `ForbiddenException`, `ConflictException`, `InternalServerErrorException`

#### Error Messages — Portuguese (pt-BR) ONLY

```typescript
throw new NotFoundException('Usuário não encontrado')        // ✅
throw new ConflictException('E-mail já cadastrado')          // ✅
throw new UnauthorizedException('Email ou senha inválidos')  // ✅
throw new NotFoundException('User not found')                // ❌
```

Messages must be clear, human-readable, specific. NEVER expose internal details (SQL, stack traces, Prisma messages).

### Error Flow

```
Service throws NestJS exception → AllExceptionsFilter (global) → Structured response to client
```

### Service Rules

- Naming: `create`, `findOne`, `findByEmailWithPassword`, `update`, `remove` — never vague names
- Cross-module: inject other services (e.g. `AuthService` injects `UserService`, `HashService`)
- Max ~50-80 lines per method. Split if larger
- FORBIDDEN: HTTP concepts (req/res), unrelated responsibilities, `services/` subfolder, error messages em English

---

## Prisma

### Location

`modules/database/prisma.service.ts` — NÃO existe pasta `src/prisma/`.

```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() { await this.$connect() }
}
```

`DatabaseModule` exports `PrismaService`. Feature modules import `DatabaseModule`.

### Query Rules

- Always use `select` to limit returned fields — NEVER return password/tokens
- Use `include` intentionally and sparingly
- Use `prisma.$transaction()` for multi-step atomic operations
- Keep queries simple and readable

### Access Rules

- Inject via constructor: `constructor(private readonly prisma: PrismaService) {}`
- Used ONLY inside services — NEVER in controllers
- Don't expose PrismaService across modules (use the module's service)
- Don't access another module's PrismaService directly

---

## Authentication

### Strategy

JWT-based, stateless. Token in HTTP-only cookies. NO passport/passport-jwt.

### Auth Flow

```
POST /auth/login
  → AuthController receives SignInDto
  → AuthService.signIn(email, password)
      → UserService.findByEmailWithPassword(email)
      → HashService.comparePassword(plain, hash)
      → if invalid → throw UnauthorizedException('E-mail ou senha inválidos')
      → jwtService.signAsync({ sub: user.id, name: user.name })
      → return { access_token }
  → res.cookie('access_token', access_token, cookieConfig)
  → return { message: 'Sign In successful' }

POST /auth/logout
  → res.clearCookie('access_token', cookieConfig)
  → return { message: 'Logged out' }
```

### Module Responsibilities

**AuthService**: validate credentials (email+password), generate JWT via `jwtService.signAsync()`, return `{ access_token }`. Does NOT set cookies.

**AuthController**: receives `SignInDto`, calls `authService.signIn()`, sets/clears cookie via `@Res({ passthrough: true })`, returns `{ message }`.

**HashService** (`common/hash/`): `hashPassword(plain)` and `comparePassword(plain, hash)` via bcrypt. Used by `UserService` (create/update) and `AuthService` (login). NEVER implement bcrypt directly em services.

### JWT Payload (minimal)

```typescript
const payload = { sub: user.id, name: user.name }
```

NEVER include sensitive data (password, email, roles) no JWT.

### Cookie Config (MANDATORY)

Import from `src/common/config/cookie.config.ts`:

```typescript
export const cookieConfig: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'strict',
  maxAge: 1000 * 60 * 60 * 24, // 1 day
}
```

Always use `cookieConfig` for both `res.cookie()` and `res.clearCookie()`. Use `@Res({ passthrough: true })` — NEVER `@Res()` alone. NEVER hardcode cookie options. NEVER store tokens in localStorage or response body.

---

## Guards

Location: `src/common/guards/auth/`

### BaseJwtGuard (abstract)

Shared JWT verification logic. `AuthGuard` and `OptionalAuthGuard` extend this.

```typescript
protected verifyToken(token: string): Promise<RequestTokenPayload> {
  return this.jwtService.verifyAsync(token, {
    secret: this.configService.get<string>('JWT_SECRET'),
  })
}
```

### AuthGuard (requires authentication)

Reads `access_token` from cookies. Throws `UnauthorizedException` if missing/expired/invalid. Sets `request.user = { sub, name }`.

### OptionalAuthGuard (optional authentication)

Never throws. Sets `request.user = null` if no token or invalid. Use for routes that work for both authenticated and unauthenticated users.

### OwnershipGuard (resource ownership)

Compares `request.user.sub` with `request.params.id`. Throws `ForbiddenException` if mismatch. MUST always be used WITH `AuthGuard`:

```typescript
@UseGuards(AuthGuard, OwnershipGuard)  // correct order
```

### Usage

```typescript
@UseGuards(AuthGuard)                    // authenticated only
@UseGuards(OptionalAuthGuard)            // optional auth
@UseGuards(AuthGuard, OwnershipGuard)    // authenticated + owner
```

Request types from `src/common/types/req-types`: `AuthenticatedRequest` (user guaranteed), `OptionalAuthRequest` (user may be null).

Feature modules import `AuthGuardModule` to use guards.

### Guard Rules

- NEVER implement auth logic manually em controllers/services
- NEVER create new JWT guards from scratch — extend `BaseJwtGuard`
- NEVER use `OwnershipGuard` without `AuthGuard`
- NEVER duplicate guard logic

---

## Security Rules

### Password

- Hash with `HashService.hashPassword()` before saving. Compare with `HashService.comparePassword()`. Strong bcrypt salt
- NEVER store/log plain passwords

### Input

- Validate ALL inputs via DTOs with `whitelist: true`, `forbidNonWhitelisted: true`
- NEVER trust client input, NEVER allow unknown fields

### Database

- Prisma prevents SQL injection. Always exclude sensitive fields via `select`
- NEVER expose internal data structures

### API

- Use guards for protected routes. Restrict access properly
- Protect sensitive endpoints (login, auth) with rate limiting

### Logging

- Log important actions (auth, errors). NEVER log sensitive data

### Must Prevent

XSS, injection attacks, broken auth flows, data leaks, insecure storage.

Principle of least privilege — grant only necessary access.

Security é NON-NEGOTIABLE. Any risk → STOP → Refactor immediately.
