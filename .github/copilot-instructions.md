# GitHub Copilot Instructions

This repository is a **TypeScript monorepo** using:

- TanStack Start / TanStack Router
- React
- shadcn/ui
- Tailwind CSS
- ORPC (RPC layer)
- Drizzle ORM
- Zod
- Turborepo + pnpm workspaces

Copilot must follow all rules below when generating or modifying code.

---

## 0. General Principles

1. Always generate **TypeScript**.
2. Do not invent:
   - environment variables
   - secrets or API keys
   - new top-level folder structures
   - new architectural patterns unless explicitly instructed
3. Follow existing naming conventions, file structures, and type patterns.
4. When unsure, prefer generating a minimal placeholder + `TODO:` comment instead of guessing.

---

## 1. Monorepo Conventions

1. All applications live under `apps/*`.  
   All shared libraries live under `packages/*`.
2. Prefer importing utilities/components/types from shared packages  
   rather than duplicating code.
3. Use workspace path aliases defined in `tsconfig.base.json` (e.g. `@acme/*`).  
   Do **not** generate long relative paths.

---

## 2. TanStack Start & Routing Rules

1. Follow the existing routing structure under the `routes/` directory:
   - `route.tsx`
   - `layout.tsx`
   - `loader`, `beforeLoad`, `meta`, etc.
2. Do not create new abstractions around `createFileRoute` or route factories unless a comment explicitly requests it.
3. Respect the existing URL structure.  
   Never modify:
   - route params
   - search param shapes
   - canonical URL rules
   - SEO paths
   unless explicitly asked.

---

## 3. React & Component Rules

1. Always use **functional components** and **React hooks**.
2. Only add `"use client"` when required (state, effects, browser APIs, interactive UI).
3. Follow existing component patterns:
   - colocated `loader`, `meta`, `ErrorBoundary`, etc.
   - consistent naming (`SomethingCard`, `SomethingList`, `SomethingSection`)
4. Avoid unnecessary `useEffect`.  
   Prefer derived state, memoization, or server loaders where possible.

---

## 4. shadcn/ui Conventions

1. Always use existing shadcn components from `@/components/ui` or the workspace UI package.
2. When creating new UI components:
   - follow existing folder structure
   - match prop naming conventions
   - use `cva` for variants when appropriate
3. Do not reinvent primitives (`Button`, `Input`, `Dialog`, etc.).

---

## 5. Tailwind CSS Rules

1. Use Tailwind utility classes that match the project's design scale.  
   Do not invent arbitrary spacing (e.g. `mt-7`, `px-9`) unless already used in the codebase.
2. Use responsive breakpoints and container queries as configured in `tailwind.config.ts`.
3. Prefer Tailwind utilities over custom CSS unless absolutely necessary.
4. Reuse existing custom utilities from `@layer utilities`.

---

## 6. SEO, Metadata & URL/Slug Rules

1. Do not change:
   - canonical URL logic
   - slug formats
   - locale rules
   - URL encoding conventions
2. Use existing slug helpers or URL builders if present.
3. When generating metadata:
   - follow existing patterns (`meta`, `metaFn`, `createMeta`)
   - include Open Graph & Twitter meta only if matching current conventions
4. Never introduce `noindex`/`nofollow` unless instructed by comments.

---

## 7. ORPC Rules

1. Follow the established ORPC structure:
   - routers
   - procedures
   - server handlers
   - client callers
2. Always validate inputs using Zod schemas.
3. Do not create ORPC endpoints with new naming conventions.  
   Follow the existing domain structure (e.g. `user.*`, `listing.*`, `admin.*`).
4. Error handling should use the project’s existing helpers or error classes.

---

## 8. Drizzle ORM Rules

1. Follow existing schema conventions:
   - `pgTable` or the current dialect
   - consistent naming (`snake_case` for DB columns, `camelCase` in TS)
2. Do not write destructive migrations unless explicitly instructed.
3. For complex SQL:
   - prefer Drizzle query builder
   - use raw SQL only when absolutely necessary
4. Respect existing indexes, constraints, and foreign keys.  
   Do not modify schema design arbitrarily.

---

## 9. Validation & Zod Rules

1. Always validate ORPC input using Zod schemas.
2. Do not invent new schemas with inconsistent naming.  
   Follow patterns like:
   - `SomethingInputSchema`
   - `SomethingOutputSchema`
3. Reuse existing schemas when possible.

---

## 10. Error Handling & Security

1. Never log or expose:
   - tokens
   - passwords
   - sensitive business logic
   - private user data
2. Use the project’s existing error utilities (`AppError`, `Unauthorized`, etc.).
3. Apply role/permission guards exactly as the codebase requires.  
   Do not modify guard logic unless explicitly instructed.

---

## 11. Testing Conventions

1. Follow the existing test framework (Vitest/Jest/Playwright depending on the project).
2. Generate tests only when meaningful:
   - utils
   - ORPC router logic
   - schema validation
3. Avoid generating overly complex mocks unless needed.

---

## 12. External Libraries

1. Do **not** introduce new dependencies unless a comment explicitly says so.
2. Prefer using internal utilities from `packages/*`.

---

## 13. Instruction Priority

When generating code, Copilot must follow this priority order:

1. **Inline developer comments** (highest priority)
2. **Existing code patterns in the file**
3. **Patterns in the rest of the monorepo**
4. **Instructions in this file** (fallback)
5. **General TypeScript/React best practices** (lowest priority)

## 14. Commit Message Conventions
1. Use the imperative mood (e.g., "Add feature", "Fix bug").
2. Keep the message concise and descriptive.
3. Reference relevant issue numbers when applicable (e.g., "Fixes #123").
4. Use prefixes for clarity:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for code style changes (formatting, missing semi-colons, etc.)
   - `refactor:` for code refactoring without changing functionality
   - `test:` for adding or updating tests
   - `chore:` for maintenance tasks (build process, dependencies, etc.)
5. Commit should be two line message