# @betterstack/tests — Integration & E2E Verification Suite

Automated integration test suite verifying authentication pipelines, monitor management, and multi-tenant data isolation.

## Test Coverage
- `user.test.ts`:
  - Input schema verification on signup (rejects malformed requests).
  - Successful user registration.
  - Signin authentication and JWT generation.
  - Rejection of invalid passwords.
- `website.test.ts`:
  - Target website creation with authentication header.
  - Rejection of unauthenticated target creation requests.
  - Multi-tenant data isolation: ensures users cannot query or inspect targets owned by other users.
  - Retrieval of user-specific website list.

## Running Tests

Ensure the API server is running on `http://localhost:3001`:

```bash
# In terminal 1 (start API server on test port):
PORT=3001 bun run apps/api/index.ts

# In terminal 2:
cd apps/tests
bun test
```
