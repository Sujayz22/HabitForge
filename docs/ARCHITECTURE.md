# HabitForge Architecture & Design Documentation

## 1) Purpose and Scope
This document explains **how HabitForge is built**, **why key design choices were made**, and the **tradeoffs against alternative options**.

It covers:
- System boundaries and component responsibilities
- Request/data flow across services
- Security, scalability, and operability approach
- Design decisions and alternatives considered

---

## 2) System Overview
HabitForge is a microservice-based platform with a React frontend, an Express API gateway, domain-focused backend services, shared TypeScript utilities, and an observability stack.

### High-level topology

```text
React Client (Vite)
   |
   v
API Gateway (auth gate + proxy + metrics)
   |----> User Service
   |----> Habit Service
   |----> Club Service
   |----> Analytics Service
   |----> Task Service

Shared infra: MongoDB + Redis
Ops/Observability: Prometheus + Grafana + node-exporter + cAdvisor + Traefik
```

### Core bounded contexts
- **User Service**: identity, profile, auth lifecycle, notification prefs
- **Habit Service**: habits + logging + gamification mechanics
- **Club Service**: social grouping, memberships, club habits, leaderboard, chat/activity
- **Analytics Service**: user-facing dashboard and trends aggregation
- **Task Service**: personal task workflow and task stats

---

## 3) Architectural Approach

### 3.1 Gateway-centric API topology
HabitForge exposes a single API surface via the API Gateway. The gateway:
- terminates and validates authentication for protected routes,
- routes requests to underlying domain services,
- standardizes middleware concerns (security headers, CORS, metrics).

This keeps client integration simple (one base URL and one auth model) while allowing backend decomposition by domain.

### 3.2 Domain-oriented service decomposition
Each service owns its own route surface and business logic, reducing tight coupling between contexts. Inter-service behavior is intentionally narrow (for example, user XP/grace card update endpoints exposed for internal integration).

### 3.3 Shared package for consistency
A shared package (`@habitforge/shared`) centralizes reusable primitives such as constants, JWT helpers, metrics middleware, and utility functions. This reduces duplicate logic and helps keep behavior consistent across services.

### 3.4 Ops-first runtime posture
The repository includes production-aware operational scaffolding:
- Prometheus metric scrape model,
- Grafana provisioning + dashboards,
- host/container exporters,
- Traefik labels for ingress/TLS routing.

---

## 4) Component Responsibilities

## 4.1 Frontend (`client`)
- React + Router + React Query + context providers (auth/toast)
- Route split between public pages and authenticated app shell
- Cookie-based auth usage (`withCredentials: true`) with 401 redirect handling

## 4.2 API Gateway (`api-gateway`)
- Security middleware (`helmet`, CORS, parser stack)
- Authentication middleware on protected route groups
- Reverse-proxy forwarding (including pass-through of key response headers like `set-cookie`)
- Health + metrics endpoint support

## 4.3 User Service (`user-service`)
- Register/login/logout, forgot/reset password
- Profile lifecycle (read/update/delete)
- Account safety actions (change email/password)
- Mode selection and profile metadata
- Optional Redis-backed token blacklisting path (degrades gracefully if Redis unavailable)

## 4.4 Habit Service (`habit-service`)
- Habit CRUD
- Completion logging and habit/user stats retrieval
- Uses shared gamification logic (XP, level/momentum related calculations)

## 4.5 Club Service (`club-service`)
- Club creation/discovery/join/leave/delete
- Membership-aware habit adoption and logging
- Leaderboards + invite codes + club activity + chat history/posting
- Includes an internal route for user-deletion propagation

## 4.6 Analytics Service (`analytics-service`)
- Dashboard and trend endpoints
- Redis-assisted caching path with graceful degradation fallback

## 4.7 Task Service (`task-service`)
- Task CRUD
- Completion actions and cleanup operations
- Task statistics endpoint

## 4.8 Shared package (`shared`)
- Behavioral mode constants and rule configuration
- JWT create/verify/decode helpers
- Metrics middleware bootstrap helper
- Cross-service utilities (db/redis/logger abstractions and typing)

---

## 5) Data & State Model

### 5.1 Persistence strategy
- **MongoDB** is used for primary service data models.
- **Redis** is used for performance-sensitive and ephemeral concerns (e.g., blacklisting/caching depending on service).

### 5.2 Behavioral mode as first-class domain concept
The system encodes three behavioral modes and derives:
- XP multipliers,
- mode-specific edit/penalty policies,
- mode-sensitive limits/behavior.

This makes mode behavior explicit and inspectable rather than implicit in controller logic.

### 5.3 Derived progression model
Shared gamification utilities define deterministic formulas for:
- XP computation,
- level progression,
- next-level thresholds,
- momentum and streak-decay calculations.

This encourages consistency across consumers (service logic, analytics outputs, future workers).

---

## 6) Request Flow Patterns

### 6.1 Authenticated user journey (typical)
1. Client sends request to gateway with cookie credentials.
2. Gateway authentication middleware verifies request.
3. Gateway forwards request to domain service preserving path + method.
4. Service performs business logic and DB operations.
5. Response is returned through gateway back to client.

### 6.2 Public auth flow
1. Client calls `/api/auth/*` through gateway.
2. Gateway bypasses auth middleware for this route group.
3. User service handles account/auth lifecycle operation.

### 6.3 Observability flow
1. Each service exposes `/metrics` via shared middleware.
2. Prometheus scrapes targets on configured intervals.
3. Grafana dashboards visualize API and runtime performance.

---

## 7) Security Architecture

### Implemented posture
- Cookie-aware auth model (`withCredentials`) on client.
- JWT utilities for token operations.
- Gateway-side auth enforcement for protected route groups.
- Helmet and CORS policies across services.
- 404/error-handler defaults to avoid accidental fall-throughs.

### Security tradeoffs
- Central auth gate at gateway simplifies policy enforcement but can become a single policy bottleneck.
- Cookie-based auth improves browser integration and avoids localStorage token exposure, but requires careful CORS/credential configuration across environments.

---

## 8) Scalability & Reliability Considerations

### Strengths of current design
- Horizontal scalability at service granularity.
- Domain faults isolated better than monolith coupling.
- Redis optionality: critical paths degrade with warnings when Redis is unavailable in some services.
- Service-level health endpoints support orchestration readiness checks.

### Current constraints
- Synchronous request chaining through gateway means downstream latency directly impacts client experience.
- Some cross-service operations are still direct HTTP coupling rather than event-driven propagation.
- No explicit service mesh/circuit breaker layer is present in repo-level implementation.

---

## 9) Design Tradeoffs vs Alternatives

## 9.1 Microservices vs Monolith
**Chosen:** microservices by domain.

- **Pros:** clear bounded contexts, independent deployment/scaling, team parallelism.
- **Cons:** distributed complexity, more infra overhead, more network failure modes.
- **Alternative (modular monolith):** simpler ops and easier local debugging; less independent scaling and harder long-term domain ownership boundaries.

## 9.2 API Gateway proxy vs direct client-to-service calls
**Chosen:** gateway proxy.

- **Pros:** one client contract, centralized auth/security middleware, easier policy enforcement.
- **Cons:** extra hop and potential bottleneck.
- **Alternative (direct calls):** lower latency per call path and less gateway complexity; but client becomes topology-aware and policy consistency drifts.

## 9.3 JWT + cookie-oriented browser auth vs bearer token in localStorage
**Chosen:** cookie-credential flow in client.

- **Pros:** avoids JS-managed token persistence, cleaner browser credential handling.
- **Cons:** stricter CORS/CSRF hygiene requirements and cookie-domain deployment considerations.
- **Alternative (localStorage bearer):** easier cross-origin testing in some setups; larger XSS blast radius.

## 9.4 Shared TypeScript package vs duplicated utility logic
**Chosen:** shared package.

- **Pros:** consistent constants/math/helpers, fewer drift bugs.
- **Cons:** package coupling and coordinated versioning/release needs.
- **Alternative (copy/paste):** fewer inter-package concerns initially; rapid entropy and inconsistent behavior over time.

## 9.5 Redis optional degradation vs hard dependency
**Chosen:** best-effort Redis for select concerns.

- **Pros:** higher availability posture (core flows can continue when Redis is down in some contexts).
- **Cons:** feature degradation complexity and behavior variance.
- **Alternative (hard fail):** simpler reasoning/guarantees, but lower overall availability.

## 9.6 Prometheus pull model vs push-first metrics model
**Chosen:** pull-based scraping.

- **Pros:** standard cloud-native model, easy target discovery in containerized setups.
- **Cons:** requires network reachability and scrape config discipline.
- **Alternative (push):** can simplify disconnected network segments but adds push gateway and delivery semantics complexity.

---

## 10) Evolution Path (Recommended)

### Near-term
- Introduce explicit API contracts (OpenAPI per service + generated types).
- Add contract/integration tests at gateway boundaries.
- Harden resilience patterns (timeouts/retries/circuit-breakers with policy per route).

### Mid-term
- Move internal cross-service side effects toward event-driven messaging for lower runtime coupling.
- Add idempotency keys for write-heavy/critical endpoints.
- Introduce distributed tracing (OpenTelemetry) alongside metrics.

### Long-term
- Consider service ownership scorecards (SLO, error budget, cost/throughput).
- Evaluate data platform split (OLTP vs analytics store) if analytics load grows.

---

## 11) Practical Mental Model for Contributors
When adding features:
1. Start in the **domain service** where the business behavior belongs.
2. Keep **shared** package changes minimal and generic.
3. Expose only required routes and secure them through the gateway policy model.
4. Emit/observe metrics for new paths.
5. Document any new cross-service coupling explicitly.

This preserves the repository’s current strengths: clear boundaries, predictable client integration, and operational visibility.

---

## 12) Requirement Coverage Assessment (Requested Evaluation)

This section answers the explicit question: **"Is this done in this project?"**

### 12.1 Analyze system requirements, identify major services and responsibilities
**Status: Implemented (Yes).**

The project is already split into major services with clear route and responsibility boundaries:
- API gateway routing/auth boundary
- user/auth lifecycle
- habits/gamification
- clubs/leaderboard/social
- analytics dashboard/trends
- task workflow

These are implemented as separate deployable services and wired in Docker Compose.

### 12.2 Implement business logic using microservices architecture
**Status: Implemented (Yes).**

Business logic is distributed by domain service (controllers/services/models per service), with a gateway as the integration entry point.

### 12.3 Tooling requirement matrix

#### i) Inter-service communication
**Status: Implemented (Partially/mostly synchronous).**

Current approach:
- HTTP/REST communication through API Gateway proxying.
- Some internal service-to-service HTTP endpoints exist for cross-domain actions.

Tradeoff:
- Simpler and easy to debug,
- but introduces tighter runtime coupling and synchronous dependency chains.

Alternative upgrade path:
- Keep sync HTTP for read/query and user-request paths,
- add event bus for side-effects and cross-service eventual consistency.

#### ii) Concurrency control and consistency handling
**Status: Implemented at baseline, not fully explicit at distributed level.**

Current approach:
- MongoDB-backed document writes with service-owned models.
- Deterministic shared utility logic for XP/levels helps consistency of calculations.

Observed gap:
- No explicit distributed transaction/orchestration strategy, outbox, or idempotency standard documented at repo level.

Recommended options:
1. Add optimistic concurrency/versioning on mutable aggregates.
2. Add idempotency keys for create/complete endpoints.
3. Use outbox + consumer dedupe if event-driven integration is introduced.

#### iii) Caching mechanisms
**Status: Implemented (Yes).**

Current approach:
- Redis-backed caching/blacklisting in relevant services.
- Graceful degradation in some services when Redis is unavailable.

Tradeoff:
- Better availability and performance,
- but requires careful cache invalidation discipline and stale data tolerances.

#### iv) Event-driven messaging and asynchronous processing
**Status: Partially implemented conceptually; not fully implemented as message-bus architecture.**

Current approach:
- Architecture docs reference worker/asynchronous ideas, and services perform synchronous HTTP integration.
- No dedicated broker (Kafka/RabbitMQ/NATS/SQS) integration is present in the current repository runtime.

Conclusion:
- Async/event-driven messaging is **not fully realized yet** and remains a recommended next step.

---

## 13) Concrete Recommendation: Target Architecture for Full Requirement Compliance
To fully satisfy all stated requirements with strong distributed-system guarantees:

1. **Introduce message broker** (RabbitMQ or Kafka).
2. **Define domain events** (`habit.logged`, `xp.updated`, `club.member.joined`, `task.completed`).
3. **Adopt outbox pattern** in each write service.
4. **Add idempotent consumers** with dedupe store.
5. **Keep API Gateway + sync HTTP** for immediate client response paths.
6. **Use async events for cross-service side-effects** and analytics materialization.
7. **Add replayable projections** for leaderboard/analytics views.

This hybrid model preserves current simplicity while closing the gap on event-driven and distributed consistency requirements.
