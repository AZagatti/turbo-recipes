# Turbo Recipes API

[![CI](https://github.com/AZagatti/turbo-recipes/actions/workflows/ci.yml/badge.svg)](https://github.com/AZagatti/turbo-recipes/actions/workflows/ci.yml)
[![CD](https://github.com/AZagatti/turbo-recipes/actions/workflows/cd.yml/badge.svg)](https://github.com/AZagatti/turbo-recipes/actions/workflows/cd.yml)
[![Coverage Status](https://coveralls.io/repos/github/AZagatti/turbo-recipes/badge.svg)](https://coveralls.io/github/AZagatti/turbo-recipes)
![GitHub License](https://img.shields.io/github/license/azagatti/turbo-recipes)
![GitHub language count](https://img.shields.io/github/languages/count/azagatti/turbo-recipes)
![GitHub top language](https://img.shields.io/github/languages/top/azagatti/turbo-recipes)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![GitHub repo size](https://img.shields.io/github/repo-size/azagatti/turbo-recipes)
![Codacy grade](https://img.shields.io/codacy/grade/fd5a895cd3e94b98b7dd32a2919c5295)

A production-ready RESTful API for a recipe management platform, built with Node.js, Fastify, and TypeScript, following modern software architecture and development practices.

---

## 🏛️ Architecture & System Design

This project was built following **Hexagonal Architecture** (Ports and Adapters) to ensure a clear separation between the core business logic and infrastructure-level details. This approach promotes high testability, maintainability, and framework independence.

Key architectural decisions include:
- **Domain-Driven Design (DDD):** Focusing on the core domain of recipes and users.
- **Test-Driven Development (TDD):** The core logic was developed following a strict Red-Green-Refactor cycle.
- **SOLID Principles:** Applied throughout the codebase to create clean, decoupled components.
- **Dependency Injection:** Using `tsyringe` to manage dependencies and invert control.

For a deep dive into the system architecture, data models, and API contract, please refer to the **[DESIGN.md](./DESIGN.md)** file.

---

## 📁 Project Structure

```tree
src/
├── core/                   # Domain layer (business rules)
│   ├── contracts/            # Interfaces for external dependencies
│   ├── entities/             # Domain entities
│   ├── errors/               # Domain-specific errors
│   ├── repositories/         # Repository interfaces
│   └── use-cases/            # Application business rules
│       └── _test/              # Test utilities and mocks
├── infra/                  # Infrastructure layer
│   ├── cache/                # Redis cache implementation
│   ├── cryptography/         # Encryption and token handling
│   ├── db/                   # Database configuration and migrations
│   ├── http/                 # HTTP server setup and routes
│   ├── mail/                 # Email service implementation
│   ├── queue/                # Background job processing
│   └── telemetry/            # Observability setup
└── main/                   # Application entry point
    ├── plugins/              # Fastify plugins
    ├── app.ts                # App configuration
    ├── config.ts             # Environment variables
    ├── container.ts          # Dependency injection setup
    ├── server.ts             # HTTP server
    └── worker.ts             # Background worker
```

---

## ✨ Features

- **User Management & Authentication:** Secure user registration and JWT-based authentication.
- **Full Recipe CRUD:** Create, Read, Update, and Delete operations for recipes.
- **Authorization:** Users can only modify or delete their own recipes.
- **Full-Text Search:** Performant recipe search by title and ingredients using PostgreSQL's native FTS.
- **Background Job Processing:** Asynchronous email sending for password resets using BullMQ and Redis.
- **API Documentation:** Auto-generated and interactive API documentation with OpenAPI (Swagger/Scalar).
- **Scalability:** Built with Node.js Cluster module to leverage multiple CPU cores.
- **Observability:** Comprehensive monitoring with a full OpenTelemetry and PLG (Prometheus, Loki, Grafana) stack.

---

## 🚀 Tech Stack

- **Backend:** Node.js, Fastify, TypeScript
- **Database:** PostgreSQL (with Drizzle ORM)
- **Cache & Queues:** Redis, BullMQ
- **Architecture:** Hexagonal, TDD, DDD, SOLID
- **Testing:** Vitest, Supertest
- **Observability:** OpenTelemetry, Prometheus, Loki, Grafana
- **Containerization:** Docker, Docker Compose
- **CI/CD:** GitHub Actions

---

## 🔒 Security

The API implements several security measures:
- Rate limiting: Requests are limited to prevent abuse
- Helmet: HTTP headers are properly set for security
- JWT Authentication: Secure token-based authentication
- Password Hashing: Passwords are hashed using bcrypt
- Input Validation: All requests are validated using schemas

---

## 📊 Observability

The application is fully instrumented with **OpenTelemetry**, exporting metrics to a local monitoring stack composed of Prometheus, Loki, and Grafana. The Grafana dashboard provides real-time insights into the API's "Golden Signals":

- **Latency:** p99 response time per route.
- **Throughput:** Requests per second (RPS) per route.
- **Error Rate:** Percentage of `4xx` errors per route.
- **Error Rate:** Percentage of `5xx` errors per route.

![Grafana Dashboard Screenshot](https://res.cloudinary.com/zagatti/image/upload/v1759281191/turbo-recipes/grafana_keugbz.png)

[Grafana Dashboard File](https://res.cloudinary.com/zagatti/raw/upload/v1759281191/turbo-recipes/grafana-turbo-repo_c6ml4z.json)

---

## 🏁 Getting Started

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- pnpm
- Docker & Docker Compose

### Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AZagatti/turbo-recipes.git
    cd turbo-recipes
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Setup environment variables:**
    Copy the `.env.example` file to a new `.env` file and fill in the required values.
    ```bash
    cp .env.example .env
    ```

4.  **Start the infrastructure and the application:**
    This command will start the PostgreSQL, Redis, Prometheus, Grafana, and Loki containers, along with the API server in watch mode.
    ```bash
    docker-compose up -d
    ```
    - **API:** Running on `http://localhost:3333`
    - **Grafana:** `http://localhost:3000` (admin/admin)
    - **Prometheus:** `http://localhost:9090`

---

## 🧪 Running Tests

The project has a comprehensive test suite divided into three categories:

- **Unit Tests:**
  ```bash
  pnpm test:unit
  pnpm test:unit:watch
  ```

- **Integration Tests:**
  ```bash
  pnpm test:integration
  pnpm test:integration:watch
  ```

- **End-to-End (E2E) Tests:**
  ```bash
  pnpm test:e2e
  pnpm test:e2e:watch
  ```

- **Run all tests:**
  ```bash
  pnpm test
  pnpm test:ci
  ```

- **Generate coverage report:**
  ```bash
  pnpm test:coverage
  ```

---

## 🗂️ API Collection

An Insomnia workspace export is available to easily test all API endpoints. You can import it from the file below:

- [![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://res.cloudinary.com/zagatti/raw/upload/v1759281595/turbo-recipes/Insomnia-turbo-repo_ypnavm.yaml)

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
