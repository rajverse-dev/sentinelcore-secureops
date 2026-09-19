# SentinelCore SecureOps

SentinelCore SecureOps is a React/MUI security operations console backed by a
Spring Boot service and PostgreSQL.

## Milestone 2

Milestone 2 provides authenticated Asset Management and Vulnerability
Management. Vulnerabilities belong to assets and are exposed through DTO-based
REST endpoints. Duplicate findings are scoped to an asset, vulnerability
identifier, and affected component.

Architecture:

```text
Frontend -> Axios + JWT -> Spring Boot Controller -> Service -> Repository -> PostgreSQL
									  |
									  +-- Asset 1:N Vulnerability
```

### Run locally

Backend:

```text
cd backend/asset-service
./mvnw.cmd test
./mvnw.cmd spring-boot:run
```

Frontend:

```text
cd Frontend
npm install
npm run dev
```

Configure PostgreSQL and the local backend through environment/application
configuration. Do not place production credentials or JWT secrets in source
control.

### Main routes

- `/dashboard` shows asset and vulnerability security summaries.
- `/assets` manages the asset inventory.
- `/assets/{id}` shows asset information and related vulnerabilities.
- `/threat-detection` manages vulnerabilities.
- `/vulnerabilities/{id}` shows vulnerability details.