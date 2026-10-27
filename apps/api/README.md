# @betterstack/api — Backend Gateway & Telemetry Service

The core REST API gateway powering authentication, target website management, and telemetry queries.

## Tech Stack
- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: Express 5 (TypeScript)
- **Authentication**: Stateless JWT (`jsonwebtoken`)
- **Schema Validation**: [Zod](https://zod.dev/)
- **Database**: PostgreSQL via `@repo/store` (Prisma ORM)

## Endpoints

| Method | Route | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/user/signup` | No | Registers user with username & password |
| `POST` | `/user/signin` | No | Authenticates credentials and returns JWT |
| `POST` | `/website` | Yes | Adds a new website target for monitoring |
| `GET` | `/websites` | Yes | Retrieves user's monitored targets + latest status tick |
| `GET` | `/status/:websiteId` | Yes | Fetches website details and the 10 most recent ticks |

## Environment Variables

```env
PORT=3000
JWT_SECRET="your-secret-key"
DATABASE_URL="postgresql://postgres:password@localhost:5432/betterstack?schema=public"
```

## Running Locally

```bash
bun install
bun run index.ts
```
