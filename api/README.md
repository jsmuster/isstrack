# Issue Tracker Backend API

Backend-only MVP for Issue Tracker (Java 17, Spring Boot 3.x, Postgres, Flyway, JWT, STOMP).

## Prerequisites
- Java 17
- Docker + Docker Compose (optional)

## Run With Docker
```bash
docker compose up --build
```

## Run Locally
```bash
./mvnw spring-boot:run
```

## Default Local DB
- JDBC: `jdbc:postgresql://localhost:5432/issuetracker`
- User: `issuetracker`
- Password: `issuetracker`

## Sample Curl
Register:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","username":"user1","password":"Password123!","firstName":"Test","lastName":"User"}'
```

Login:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"user1","password":"Password123!"}'
```

Create Project:
```bash
curl -X POST http://localhost:8080/api/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Sample Project"}'
```

Create Issue:
```bash
curl -X POST http://localhost:8080/api/projects/1/issues \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Bug","description":"Details","priority":"HIGH","tags":["backend"]}'
```

List Issues:
```bash
curl -X GET "http://localhost:8080/api/projects/1/issues?status=OPEN&q=bug" \
  -H "Authorization: Bearer $TOKEN"
```

Patch Issue:
```bash
curl -X PATCH http://localhost:8080/api/issues/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"IN_PROGRESS"}'
```

## WebSocket
Endpoint: `ws://localhost:8080/ws`

Preferred: Send STOMP `CONNECT` with `Authorization: Bearer <jwt>` header.

Fallback (if enabled): `ws://localhost:8080/ws?token=<jwt>`

Topics:
- `/topic/projects.{projectId}` (IssueDto, MembershipDto)
- `/topic/issues.{issueId}` (CommentDto, ActivityDto)
- `/user/queue/notifications` (NotificationDto)

## DTO Constraints
- Issue title max 200
- Description max 20000
- Comment body max 5000
- Password min 8
