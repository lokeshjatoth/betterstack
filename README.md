# BetterStack — Distributed Real-Time Uptime & Latency Telemetry Platform

[![Turborepo](https://img.shields.io/badge/Monorepo-Turborepo-000000?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/)
[![Runtime](https://img.shields.io/badge/Runtime-Bun%201.3-FBF0DF?style=for-the-badge&logo=bun&logoColor=black)](https://bun.sh/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Redis](https://img.shields.io/badge/Queue-Redis%20Streams-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![ORM](https://img.shields.io/badge/ORM-Prisma%206-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> **Engineered a scalable distributed computing system using Turborepo, enabling real-time uptime and latency tracking for 100+ websites with sub-500ms precision.**

---

## 📌 Executive Overview

**BetterStack** is a distributed, multi-region synthetic monitoring platform designed for real-time uptime verification, fault detection, and millisecond-level network latency profiling. 

Built from the ground up as a high-performance **Turborepo** monorepo powered by **Bun**, the platform decouples target scheduling, message distribution, and edge probe execution through **Redis Streams** and **PostgreSQL**. The result is a resilient distributed system capable of tracking dozens to hundreds of concurrent endpoints with sub-500ms latency precision and regional fault isolation.

---

## 🏛️ System Architecture

```mermaid
flowchart TB
    subgraph ClientLayer["Frontend & Control Plane"]
        UI["Next.js 16 Web Dashboard\n(App Router + Tailwind CSS)"]
        API["Express.js API Gateway\n(JWT Auth + Zod Validation)"]
    end

    subgraph StorageLayer["Data & Persistence Layer"]
        PG[("PostgreSQL\n(Prisma ORM)")]
        RStreams[("Redis Streams\nStream: 'betterstack:websites'")]
    end

    subgraph SchedulingLayer["Scheduling Plane"]
        Pusher["Pusher Daemon\n(3s Polling Loop + xAddBulk)"]
    end

    subgraph WorkerMesh["Distributed Worker Mesh"]
        subgraph RegionUS["Region: us-east (Consumer Group)"]
            W1["Worker 1\n(xReadGroup)"]
            W2["Worker 2\n(xReadGroup)"]
        end
        subgraph RegionEU["Region: eu-west (Consumer Group)"]
            W3["Worker 3\n(xReadGroup)"]
        end
        subgraph RegionAP["Region: ap-south (Consumer Group)"]
            W4["Worker 4\n(xReadGroup)"]
        end
    end

    subgraph Targets["Monitored Targets (100+ Endpoints)"]
        T1["Target Website A"]
        T2["Target Website B"]
        TN["Target Website N"]
    end

    %% Interactions
    UI <-->|"REST API / Bearer JWT"| API
    API <-->|"Reads / Writes"| PG

    Pusher -->|"Fetch Monitored Websites"| PG
    Pusher -->|"xAddBulk Pipeline"| RStreams

    RStreams -->|"Pull Jobs & ACK"| W1
    RStreams -->|"Pull Jobs & ACK"| W2
    RStreams -->|"Pull Jobs & ACK"| W3
    RStreams -->|"Pull Jobs & ACK"| W4

    W1 -.->|"HTTP GET Probe"| T1
    W2 -.->|"HTTP GET Probe"| T2
    W3 -.->|"HTTP GET Probe"| TN
    W4 -.->|"HTTP GET Probe"| T1

    W1 -->|"Write website_tick (latency & status)"| PG
    W2 -->|"Write website_tick (latency & status)"| PG
    W3 -->|"Write website_tick (latency & status)"| PG
    W4 -->|"Write website_tick (latency & status)"| PG
```

### End-to-End Data Lifecycle

1. **Target Ingestion & Setup**: Users authenticate and register target URLs through the **Next.js Dashboard** and **Express API Server**.
2. **Periodic Dispatching**: The **Pusher Service** queries PostgreSQL at 3-second intervals for all registered targets and enqueues inspection payloads into the Redis Stream `betterstack:websites` using batched `xAddBulk` pipelines.
3. **Consumer-Group Load Balancing**: Probe nodes run in regional consumer groups (`REGION_ID`). Each worker (`WORKER_ID`) claims a batch of targets using non-blocking/blocking `xReadGroup` commands (`COUNT: 5`, `BLOCK: 2000`).
4. **Sub-500ms Precision Probing**: Workers execute non-blocking concurrent HTTP requests to all endpoints in their claimed batch, measuring time-to-first-byte and full response duration:
   $$\Delta t = t_{\text{end}} - t_{\text{start}} \quad (\text{ms})$$
5. **Telemetry Persistence & Acknowledgment**:
   - The result (`Up` or `Down`, exact millisecond `response_time_ms`, `region_id`, `website_id`, and `createdAt`) is recorded as a `website_tick` row in PostgreSQL.
   - Processed message IDs are bulk-acknowledged (`xAckBulk`) to Redis Streams, guaranteeing at-least-once delivery semantics without duplicate processing within the same region.
6. **Telemetry Visualization**: The dashboard polls the API every 30 seconds to render operational health, uptime states, and a 10-tick historical latency timeline with real-time tooltips.

---

## 📂 Repository Structure

The monorepo is organized using **Turborepo** and **Bun Workspaces**:

```
betterstack/
├── apps/
│   ├── api/             # Express.js REST API with JWT auth and Zod schemas
│   ├── frontend/        # Next.js 16 (React 19) Dashboard with Tailwind CSS
│   ├── pusher/          # Periodic batch job dispatcher pushing to Redis Streams
│   ├── worker/          # Scalable distributed probe workers consuming Redis Streams
│   └── tests/           # Integration and E2E test suite powered by bun:test
│
├── packages/
│   ├── redis/           # Redis Streams client wrapper (xAddBulk, xReadGroup, xAckBulk)
│   ├── store/           # Shared Prisma schema, migrations, and PostgreSQL client
│   ├── ui/              # Shared design system components (Button, Card, Code)
│   ├── typescript-config# Reusable tsconfig presets (base, nextjs, react-library)
│   └── eslint-config/   # Unified linting rules across the monorepo
│
├── turbo.json           # Turborepo task pipeline configuration
├── package.json         # Workspace root package manifest
└── bun.lock             # Bun dependency lockfile
```

---

## 🗄️ Database Schema & Data Models

Managed centrally in [`packages/store/prisma/schema.prisma`](packages/store/prisma/schema.prisma):

```mermaid
erDiagram
    USER ||--o{ WEBSITE : owns
    WEBSITE ||--o{ WEBSITE_TICK : generates
    REGION ||--o{ WEBSITE_TICK : observes

    USER {
        string id PK "uuid"
        string username
        string password
    }

    WEBSITE {
        string id PK "uuid"
        string url
        datetime time_added
        string user_id FK
    }

    REGION {
        string id PK "uuid"
        string name
    }

    WEBSITE_TICK {
        string id PK "uuid"
        int response_time_ms
        website_status status "Up | Down | Unknown"
        string region_id FK
        string website_id FK
        datetime createdAt
    }
```

---

## 🔌 API Specification

All protected endpoints require a valid JWT passed in the `Authorization` header.

| Method | Endpoint | Auth | Description | Payload / Parameters | Response |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `POST` | `/user/signup` | ❌ | Register a new user | `{ "username": "...", "password": "..." }` | `{ "id": "uuid" }` |
| `POST` | `/user/signin` | ❌ | Authenticate and obtain JWT | `{ "username": "...", "password": "..." }` | `{ "jwt": "token" }` |
| `POST` | `/website` | ✅ | Register a new target to monitor | `{ "url": "https://example.com" }` | `{ "id": "uuid" }` |
| `GET` | `/websites` | ✅ | List all user monitors with latest tick | Headers: `Authorization: <token>` | `{ "websites": [...] }` |
| `GET` | `/status/:websiteId` | ✅ | Get target metadata & last 10 ticks | Params: `websiteId` | `{ "id": "...", "ticks": [...] }` |

---

## ⚡ Key Engineering Decisions & Benchmarks

1. **Redis Streams vs Traditional Message Queues (RabbitMQ/Kafka)**:
   - Redis Streams provide negligible memory overhead and microsecond-level ingestion latency for periodic short-lived synthetic ping tasks.
   - Built-in **Consumer Groups** (`xReadGroup`) allow multiple distributed worker processes in the same geographical region to share the queue with zero contention, while different geographical regions maintain separate consumer groups to independently monitor every website.
2. **Sub-500ms Precision Latency Measurement**:
   - Node/Bun asynchronous network socket lifecycle timers capture raw HTTP connection establishment and response round-trip latencies without blocking the event loop.
   - Workers execute probes concurrently via `Promise.all(tasks)` over bounded stream batches (`COUNT: 5`), preventing socket exhaustion while sustaining high throughput.
3. **Multi-Region Fault Isolation**:
   - Target metrics are segmented by `region_id`. A regional failure (e.g. AWS `us-east-1` degradation) does not falsely flag an endpoint as down globally, enabling granular regional status reporting.
4. **Turborepo & Bun Tooling**:
   - Zero-overhead shared code imports across services (`@repo/store`, `@repo/redis`).
   - Incremental build computation and task execution pipeline caching.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Bun](https://bun.sh/) (v1.1 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v14 or higher)
- [Redis](https://redis.io/) (v6 or higher with Streams support)
- [Node.js](https://nodejs.org/) (>= 18 for Turborepo compatibility)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/lokeshjatoth/betterstack.git
cd betterstack

# Install dependencies across all apps and packages via Bun
bun install
```

### 2. Environment Variables Setup

Create a `.env` file in the root or respective service directories:

#### PostgreSQL Database (`packages/store/.env` and root `.env`):
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/betterstack?schema=public"
```

#### API Gateway (`apps/api/.env`):
```env
PORT=3000
JWT_SECRET="your-super-secret-jwt-key"
DATABASE_URL="postgresql://postgres:password@localhost:5432/betterstack?schema=public"
```

#### Distributed Worker (`apps/worker/.env`):
```env
REGION_ID="us-east-1"
WORKER_ID="worker-node-1"
DATABASE_URL="postgresql://postgres:password@localhost:5432/betterstack?schema=public"
```

#### Next.js Frontend (`apps/frontend/.env.local`):
```env
NEXT_PUBLIC_BACKEND_URL="http://localhost:3000"
```

### 3. Initialize Database & Migrations

```bash
# Push schema or apply Prisma migrations
cd packages/store
bunx prisma migrate dev --name init
bunx prisma generate
cd ../..
```

*(Optional)* Seed a region in the database for your worker to reference:
```sql
INSERT INTO region (id, name) VALUES ('us-east-1', 'US East (N. Virginia)');
```

### 4. Initialize Redis Consumer Group

Create the stream consumer group in Redis for your target region:
```bash
redis-cli XGROUP CREATE betterstack:websites us-east-1 $ MKSTREAM
```

---

## 🏃 Running the Distributed Platform

You can run individual services or orchestrate the complete monorepo using Turborepo.

### Option A: Running with Turborepo

```bash
# Run all workspace services in development mode
bun run dev
```

### Option B: Running Individual Microservices Concurrently

Open separate terminal windows for each component:

```bash
# Terminal 1: Backend API Gateway
cd apps/api
bun run index.ts

# Terminal 2: Pusher Job Dispatcher (pumps monitoring events every 3s)
cd apps/pusher
bun run index.ts

# Terminal 3: Synthetic Probe Worker (Region: us-east-1, Worker: worker-1)
cd apps/worker
REGION_ID="us-east-1" WORKER_ID="worker-1" bun run index.ts

# Terminal 4 (Optional): Scale a second concurrent worker in the same region
cd apps/worker
REGION_ID="us-east-1" WORKER_ID="worker-2" bun run index.ts

# Terminal 5: Next.js Frontend Web Application
cd apps/frontend
bun run dev
```

Once started:
- **Frontend Dashboard**: Open [http://localhost:3000](http://localhost:3000)
- **API Server**: Listening on [http://localhost:3000](http://localhost:3000) (or configured `PORT`)

---

## 🧪 Running the Test Suite

The integration test suite in [`apps/tests`](apps/tests) validates user lifecycle management, token issuing, unauthorized access protections, and multi-tenant website isolation.

1. Start the API server on test port 3001:
   ```bash
   cd apps/api
   PORT=3001 bun run index.ts
   ```

2. Run the test suite using Bun's native fast test runner:
   ```bash
   cd apps/tests
   bun test
   ```

```
bun test v1.3.2 (x64-win32)

user.test.ts:
✓ Signup endpoints > Isnt able to sign up if body is incorrect
✓ Signup endpoints > Is able to sign up if body is correct
✓ SignIn endpoints > Isnt able to sign in if body is incorrect
✓ SignIn endpoints > Is able to sign in if body is correct

website.test.ts:
✓ Website gets created > Website not created if url is not present
✓ Website gets created > Website created if url is present
✓ Website gets created > Website is not created if header is not present
✓ Can fetch website > Is able to fetch a website that the user created
✓ Can fetch website > Cant access website created by others
✓ Should be able to get all websites > Can fetch its own set of websites

 10 pass
 0 fail
```

---

## 🛠️ Monorepo Build, Format & Lint Commands

| Task | Command | Description |
| :--- | :--- | :--- |
| **Dev** | `bun run dev` | Runs all apps and watch tasks in parallel via Turborepo |
| **Build** | `bun run build` | Builds all packages and Next.js applications |
| **Lint** | `bun run lint` | Runs ESLint validation across all workspace packages |
| **Format** | `bun run format` | Auto-formats code using Prettier |
| **Type Check** | `bun run check-types` | Executes `tsc` across all workspace apps and packages |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
