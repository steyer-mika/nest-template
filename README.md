# <ins>Nest Template</ins>

Nest Template is a comprehensive application development setup that covers various aspects, from environment setup to security, documentation, and more. This README will guide you through the setup and various features of the project.

## Setup for Development

### Requirements

- Node (v20.17.0 or higher)
- NPM (v10.9.0 or higher)
- Docker

### VS Code Extensions

- Prettier
- EsLint

(_Hint: Install the extensions under `.vscode/extensions.json`_)

### Step-by-Step Setup

1. Clone Nest Template into an empty folder.
2. Configure `.env`:
   - Replace `APP_NAME` with your project name.
   - Generate a `JWT_SECRET` using `node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"`
   - Adjust `DATABASE_URL`.
   - Set `FRONTEND_URL`.
   - Configure MailJet settings.
3. Update `package.json` (name, version, etc.).
4. Modify `/client/index.html` (name).
5. Replace `/client/favicon.ico`.
6. Add mail templates.
7. Install packages with `npm install`.
8. Start the database with `docker-compose up`.
9. Synchronize the database with `npx prisma migrate deploy`.
10. Seed the database with `npx prisma db seed`.
11. Run the development server with `npm run start:dev`.

Optional: 12. Open the official NestJS Documentation at `https://docs.nestjs.com/`.

---

## Docker

You can also use a local PostgreSQL Database.

1. Configure `.env` with `.env.development`.
2. Start Docker with `docker-compose up`.

---

## Prisma Studio

Open [Prisma Studio](https://www.prisma.io/studio) with `npx prisma studio` on localhost:5555.

---

## Authorization

### Security Endpoints

Learn more about [JWT](https://docs.nestjs.com/security/authentication).

Every endpoint is secured by default. To disable this behavior, you can use the `@Public` decorator on the controller.

To access the secured endpoints, you need an `Authorization Bearer Token` in the request headers.

Use `/auth/login` to post your `email` and `password`, and in return, you will get an **accessToken** and **refreshToken**.

The Access Token serves as the Authorization Bearer Token.

To refresh the Access Token, use the Refresh Token on `/auth/refresh` with a POST request and body containing the `refreshToken`.

### Role Authority

Explore [CASL](https://casl.js.org/v6/en/).

In CASL, every schema is a **Subject**. Each Subject has multiple **Actions** (default CRUD methods and Manage, which represents all actions).

Users are granted access to various actions on a subject based on their role.

### Verify Email

After a user registers or the endpoint `/auth/email/email-verification` is called, an email is sent via an SMTP server to verify the user's email address.

You can edit the email template under `src/mail/templates/*.hbs`, and configure frontend endpoints in `src/config/endpoints.ts`.

To verify the user's email, call `/auth/verify-email`.

**Note: All endpoints that are not GET requests cannot be called until the email is verified.**

### Reset Password

If a user forgets their password, they can send themselves an email to reset it. The endpoint is at `/auth/email/reset-password`.

You can edit the reset password template under `src/mail/templates/*.hbs`, and configure frontend endpoints in `src/config/endpoints.ts`.

To reset the password, send the token and the new password to the endpoint `/auth/reset-password`.

---

## Features

### Compression

Learn about [Compression](https://docs.nestjs.com/techniques/compression), which greatly reduces the size of the response body, increasing the speed of a web app.

### Helmet

Learn about [Helmet](https://docs.nestjs.com/security/helmet), which helps protect your app from well-known web vulnerabilities by setting appropriate HTTP headers. Helmet is a collection of smaller middleware functions that set security-related HTTP headers.

### Cross-origin Resource Sharing

Learn about [CORS](https://docs.nestjs.com/security/cors), a mechanism that allows resources to be requested from another domain. By default, only the Frontend URL in `.env` can access the backend.

### Serve Static

Learn about serving static files with [Static Serve](https://docs.nestjs.com/recipes/serve-static). This serves all files in the `client` folder.

### Seeds

In the Prisma folder, you can write your own seeds with `@faker-js/faker`.

Seed the database with `npx prisma db seed`.

### Logger

Learn about the custom logger service with [winston](https://github.com/gremo/nest-winston). It prints to the console and to files in `logs`.

In development, it logs all messages with log level `Debug`, and in production, it uses log level `Info`.

All HTTP requests are logged with a custom middleware.

**BUG: When a Module, Service, or Controller is injected incorrectly, NestJS won't log it due to the custom Logger Service.**

### Health-checks

[Health checks](https://docs.nestjs.com/recipes/terminus) are created to ensure that external services (like the database) are available and can be accessed via `/health`.

### Rate Limiting

Global [Throttler](https://docs.nestjs.com/security/rate-limiting) can be configured in `.env`:

- THROTTLER_TTL: the number of seconds that each request will last in storage.
- THROTTLER_LIMIT: the maximum number of requests within the TTL limit.

### Validation

[Validation](https://docs.nestjs.com/techniques/validation) via DTO. Check available rules and transforms [here](https://github.com/typestack/class-validator#validation-decorators).

### Prisma

Learn about [Prisma](https://www.prisma.io/) and [Nest Prisma](https://docs.nestjs.com/recipes/prisma).

#### Migrations

[Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate) the database with `npx prisma migrate dev --name ${__name__}`. Replace `${__name__}` with the migration name.

#### Transactions

Use [Transactions](https://www.prisma.io/docs/concepts/components/prisma-client/transactions) with `prisma.$transaction([ ... ])`.

### Environment Variables

Learn about [Configuration](https://docs.nestjs.com/techniques/configuration).

---

## Documentation

### Full Documentation

Automatic Project Documentation with [Compodoc](https://docs.nestjs.com/recipes/documentation).

Generate documentation for the current codebase with `npm run doc:generate`. Access it at `http://localhost:4201` with `doc:serve`.

### API Documentation

Automatic API Documentation with [Swagger](https://docs.nestjs.com/openapi/introduction).

Access the API documentation at `/api` (authorization is still required for secured endpoints).

---

## Tests

No Tests yet :(

---

## CLI

NestJS comes with a powerful [CLI Tool](https://docs.nestjs.com/cli/overview).

---

## Techniques

### Events

[Events](https://docs.nestjs.com/techniques/events)

### Microservices

[Microservices](https://docs.nestjs.com/microservices/basics)

### Lifecycle

[Lifecycle](https://docs.nestjs.com/fundamentals/lifecycle-events)

### File Upload

[File Upload](https://docs.nestjs.com/techniques/file-upload)

### Caching

[Caching](https://docs.nestjs.com/techniques/caching)
