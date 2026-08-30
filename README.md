# Nest AI SaaS Starter

> **This repository is a project being 100% code generated with AI Agents via human prompting and auditing.** Its true purpose is to showcase what AI-agentic development can accomplish when it is steered by an experienced software engineer.

`nest-ai-saas-starter` is an early full-stack SaaS foundation. It pairs a Vue single-page web client with a NestJS API that demonstrates a modular, testable authentication flow. The repository is intentionally small at this stage: it is a working starting point for iterating on product capabilities while making the AI-assisted engineering process observable and reviewable.

## What is implemented

- A Vue 3 + TypeScript + Vite web application.
- A NestJS 12 HTTP API with CORS, validation, and OpenAPI/Swagger documentation.
- Account registration, login, and authenticated profile retrieval.
- Password hashing with bcrypt and one-hour JWT access tokens.
- CQRS command/query handlers for authentication use cases.
- A repository abstraction with an in-memory user-store implementation.

## Architecture

The repository contains independently runnable frontend and backend applications:

```text
apps/
├── web/                         Vue 3 client (Vite)
│   └── src/
│       ├── App.vue               Application shell
│       └── components/           UI components
│
└── api/                          NestJS API
    └── src/
        ├── main.ts               HTTP bootstrap, CORS, validation, Swagger
        ├── app.module.ts         Root module and observability integration
        └── modules/
            ├── auth/             HTTP boundary and authentication use cases
            │   ├── auth.controller.ts
            │   ├── commands/     Register/login intents
            │   ├── handlers/     CQRS command/query implementations
            │   ├── queries/      Read intents
            │   ├── dto/          Request validation and normalization
            │   └── guards/       JWT bearer-token validation
            └── user/             User domain and persistence boundary
                ├── domain/       User entity and roles
                ├── repositories/ Repository contract
                └── infrastructure/In-memory repository implementation
```

### Request flow

```text
Browser
  │
  ▼
Vue/Vite web app
  │ HTTP + Bearer token
  ▼
NestJS controller
  │ DTO validation / normalization
  ▼
CommandBus or QueryBus
  ▼
Authentication handler
  │ bcrypt or JWT service
  ▼
IUserRepository
  ▼
InMemoryUserRepository (current implementation)
```

The API keeps its HTTP layer thin. Controllers translate requests into commands or queries; handlers contain the use-case logic; and handlers depend on the `IUserRepository` contract instead of a storage implementation. This makes replacing the in-memory repository with a database-backed adapter a contained infrastructure change.

## API surface

With the API running, interactive OpenAPI documentation is available at `http://localhost:3000/api/docs`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/auth/register` | Create a user account. |
| `POST` | `/auth/login` | Exchange credentials for a JWT access token. |
| `GET` | `/auth/me` | Return the current user; requires `Authorization: Bearer <token>`. |

Registration and login normalize email addresses, validate email format, and require passwords of at least eight characters. Passwords are stored as bcrypt hashes, never returned by the API.

## Run locally

Prerequisite: Node.js with Corepack/pnpm available. Each application currently owns its own package manifest and can be run independently.

```bash
# API
cd apps/api
pnpm install
pnpm start:dev
```

```bash
# Web client (in a second terminal)
cd apps/web
pnpm install
pnpm dev
```

Useful API commands:

```bash
cd apps/api
pnpm build
pnpm lint
pnpm test
pnpm test:e2e
```

## Configuration and current boundaries

Set `JWT_SECRET` for any environment beyond local development. If it is absent, the API uses a development-only fallback secret. The observability module also contains placeholder credentials and should be configured before use outside local development.

This is a starter, not a production-ready SaaS application yet:

- Users are stored in process memory and are lost when the API restarts.
- No database, migrations, refresh-token lifecycle, account recovery, or authorization policy beyond the user role model is implemented.
- The web application is still the base Vue/Vite UI and is not yet wired to the authentication API.
- No root pnpm workspace orchestration is defined; run commands from the relevant app directory.

## AI-agentic development model

Human direction and audit are first-class parts of this project. AI agents generate the implementation from explicit prompts; an experienced software engineer steers the design, reviews code and behavior, verifies assumptions, and decides what is accepted. The goal is not autonomous code generation for its own sake—it is to demonstrate a disciplined engineering workflow where agents accelerate delivery while human judgment remains accountable for architecture, quality, and product intent.
