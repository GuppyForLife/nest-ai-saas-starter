# Repository Copilot Instructions & Standards

## Architectural Principles
- **Pattern:** Modular Layered Architecture with CQRS (Command Query Responsibility Segregation) and Domain-Driven Design (DDD) concepts.
- **Layer Separation:** Controller → Command/Query Handler or Service → Domain Model/Repository → Database.
- **Dependency Inversion:** Depend on abstractions (interfaces/abstract classes), never concrete implementations. Inject services via NestJS Dependency Injection.

## Backend Standards (NestJS & TypeScript)
- **Strict Typing:** Standard TypeScript `strict: true`. Never use `any`. Define explicit interfaces or types for all request/response parameters.
- **Controllers:** Thin controllers. Responsible strictly for routing, HTTP status mapping, and Swagger metadata. Zero business logic inside controllers.
- **CQRS Rules:**
  - State mutations (Create, Update, Delete) MUST go through Command Handlers.
  - State queries (Read, List) MUST go through Query Handlers or dedicated Query Services.
  - Events MUST be emitted for cross-domain side effects via `@nestjs/cqrs` `EventBus`.
- **Validation:** All incoming request DTOs must use `class-validator` and `class-transformer` decorators. Enforce `whitelist: true` and `forbidNonWhitelisted: true` at global scope.
- **Error Handling:** Standardized error handling using native NestJS `HttpException` subclasses (`BadRequestException`, `UnauthorizedException`, `NotFoundException`, `ConflictException`). Never throw generic `Error`.

## Frontend Standards (Vue 3 + TypeScript)
- **Composition API:** Use `<script setup lang="ts">` for all components.
- **State Management:** Use Pinia stores for global or shared domain state.
- **Component Design:** Structure components into isolated feature blocks. Explicitly type props (`defineProps<Props>()`) and emits (`defineEmits<Emits>()`).

## Naming & Structure Conventions
- Variables/Functions: `camelCase`
- Classes/Types/Interfaces: `PascalCase`
- File Names: `kebab-case` with explicit suffixes (e.g., `create-user.command.ts`, `auth.controller.ts`)