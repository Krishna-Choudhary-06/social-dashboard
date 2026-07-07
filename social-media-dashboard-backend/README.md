# Social Media Dashboard Backend

Production-ready backend for the Social Media Dashboard application. Built with Node.js, Express, MongoDB, and Redis.

## Features
- Multi-tenant workspace architecture
- Role-Based Access Control (RBAC)
- Connected social accounts (Twitter, etc.)
- Rich analytics and dashboard aggregation
- Asynchronous jobs and report generation using BullMQ and Redis
- JWT Bearer Authentication

## API Documentation

This project uses OpenAPI 3.0 / Swagger for API documentation.

### Accessing the Docs
Once the server is running, you can access the interactive Swagger UI and the raw JSON specification:

- **Swagger UI**: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
- **Raw OpenAPI JSON**: [http://localhost:5000/api/docs.json](http://localhost:5000/api/docs.json)

The documentation covers all primary modules:
- Auth
- Users
- Workspace
- Media
- Connected Accounts
- Analytics
- Dashboard
- Reports
- Notifications
- Jobs

### Authentication in Swagger UI
1. Click the **Authorize** button at the top of the Swagger UI.
2. Enter your JWT token in the Value field (do not prefix with "Bearer", just the token).
3. Click **Authorize** to close the modal. Subsequent requests will automatically include the `Authorization: Bearer <token>` header.

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run unit and integration tests (with coverage)
npm test
```

### Testing Strategy
The project uses `Jest` and `Supertest` for comprehensive testing.
- **Unit Tests**: Located in `src/tests/`, these test individual modules, services, and utilities.
- **Integration Tests**: Located in `tests/integration/`, these boot up a MongoDB Memory Server and mock Redis to test end-to-end routing, authentication, authorization (RBAC), and full module lifecycles.
You can run all tests with a single command: `npm test`.
