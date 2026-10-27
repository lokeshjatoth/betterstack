# @repo/store — Central Prisma ORM & Database Layer

Central persistence package defining the PostgreSQL data models, relational constraints, and exporting the singleton `prismaClient`.

## Schema Models

- **`user`**: Stores user authentication credentials and relations to monitored targets.
- **`website`**: Tracks user-configured target URLs and their historical check ticks.
- **`region`**: Defines geographical monitoring probe regions (e.g. `us-east-1`, `eu-west-1`).
- **`website_tick`**: Time-series latency record storing `response_time_ms`, status (`Up`, `Down`, `Unknown`), timestamps, and foreign keys to `region` and `website`.

## Migrations & Generation

```bash
# Generate Prisma Client
bunx prisma generate

# Create/Apply database migrations
bunx prisma migrate dev
```
