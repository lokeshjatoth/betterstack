# @betterstack/worker — Distributed Synthetic Edge Probe Worker

Edge probe worker that consumes website check tasks from Redis Streams, performs high-precision HTTP health and latency measurements, and writes time-series telemetry ticks to PostgreSQL.

## Core Features
- **Redis Consumer Group Worker**: Uses `xReadGroup` to pull tasks from consumer groups keyed by `REGION_ID`.
- **Fault-Tolerant Acknowledgment**: Employs `xAckBulk` after batch completion to prevent task loss or duplicate processing within the same region.
- **Sub-500ms Precision Latency Timing**: Measures network round-trip duration with millisecond resolution:
  $$\text{response\_time\_ms} = t_{\text{end}} - t_{\text{start}}$$
- **Multi-Region Tagging**: Records `region_id` and `worker_id` alongside each tick (`website_tick`) for regional status isolation.

## Environment Variables

```env
REGION_ID="us-east-1"
WORKER_ID="worker-node-1"
DATABASE_URL="postgresql://postgres:password@localhost:5432/betterstack?schema=public"
```

## Running Locally

```bash
bun install
REGION_ID="us-east-1" WORKER_ID="worker-1" bun run index.ts
```
