# @repo/redis — Redis Streams Telemetry Client

Shared Redis Streams abstraction package for distributed job ingestion, consumer group queue reads, and batch acknowledgments.

## Stream Configuration
- **Stream Name**: `betterstack:websites`
- **Batch Size**: 5 messages per worker read (`COUNT: 5`)
- **Block Timeout**: 2,000ms (`BLOCK: 2000`)
- **Consumer Group Pointer**: `>` (reads only new, unassigned stream entries)

## Exported Functions

```typescript
import { xAddBulk, xReadGroup, xAckBulk } from "@repo/redis/client";

// Push website tasks to the stream
await xAddBulk([{ url: "https://example.com", id: "uuid-1" }]);

// Claim unassigned tasks for a regional worker
const messages = await xReadGroup("us-east-1", "worker-1");

// Acknowledge processed stream entries
await xAckBulk("us-east-1", messages.map(m => m.id));
```
