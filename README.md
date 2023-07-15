# <ins>Nest Template</ins>

---

## Setup for Development

### Requirements

- Node
- NPM
- Docker

### VS Code Extensions

- Prettier
- EsLint

(_Hint: install the extensions under `.vscode/extensions.json`_)

### Step for Step Setup

1. clone Nest Template in empty folder
2. configure `.env`
   - replace `APP_NAME` with project name
   - generate `JWT_SECRET` using `node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"`
   - adjust `DATABASE_URL`
   - set `FRONTEND_URL`
   - set SMTP config
3. configure `.package.json` (name, version, ...)
4. adjust `/client/index.html` (name)
5. replace `/client/favicon.ico`
6. add design to mail template
7. install packages `npm install`
8. start database `docker-compose up`
9. sync database `npx prisma migrate deploy`
10. seed database `npx prisma db seed`
11. run `npm run start:dev`

Optional: 12. Open official NestJS Documentation `https://docs.nestjs.com/`

---

## Docker

You could use local PostgreSQL Database too.

1. Configure `.env` with `.env.development`
2. Start docker with `docker-compose up`

---

## Prisma Studio

Open [Prisma Studio](https://www.prisma.io/studio) with `npx prisma studio` on localhost:5555

---

## Authorization

### Security Endpoints

[JWT](https://docs.nestjs.com/security/authentication)

Every Endpoint is secured by default. To disable this behavior you can use the `@Public` decorator on the controller.

To access the secured endpoints you need a `Authorization Bearer Token` in the request headers.

On `auth/login` you can post your `email` and `password` in return you get **accessToken** and **refreshToken**.

Access Token is the Authorization Bearer Token

And with the Refresh Token you can refresh the Access Token on `auth/refresh` with Method POST and Body `refreshToken`

### Role Authority

[CASL](https://casl.js.org/v6/en/)

In CASL there every Schema is an **Subject**.
Every Subject has multiple **Actions** (default CURD Methods and Manage that represents all Actions).

**A user gets access to various actions on a subject based on there role.**

### Verify Email

After a user has registered or the endpoint `/auth/email/email-verification` has been called, an e-mail to verify the e-mail address is sent via an smtp server.

Email template can be edited under `src/mail/templates/*.hbs` and the frontend endpoints can be configured in `src/config/endpoints.ts`.

To verify the users email call `/auth/verify-email`.

**Note: All endpoints that are not GET requests cannot be called as long as the email is not verified**

### Reset Password

f a user forgets his password, he can send himself an email to reset his password. The endpoint is on `/auth/email/reset-password`.

Reset password template can be edited under `src/mail/templates/*.hbs` and the frontend endpoints can be configured in `src/config/endpoints.ts`.

To reset the password, the token and the new password must be sent to the endpoint `/auth/reset-password`.

---

## Features

### Compression

[Compression](https://docs.nestjs.com/techniques/compression) greatly decrease the size of the response body, thereby increasing the speed of a web app.

### Helmet

[Helmet](https://docs.nestjs.com/security/helmet) helps to protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately. Generally, Helmet is just a collection of smaller middleware functions that set security-related HTTP headers.

### Cross-origin resource sharing

[Cors](https://docs.nestjs.com/security/cors) is a mechanism that allows resources to be requested from another domain.
**By default only the Frontend Url in .env is able to access backend**

### Serve Static

[Static Serve](https://docs.nestjs.com/recipes/serve-static)
Serves all files in `client`.

### Seeds

In prisma folder you can write your own seeds with `@faker-js/faker`.

You can seed with `npx prisma db seed`

### Logger

[Custom Logger](https://docs.nestjs.com/techniques/logger) Service with [winston](https://github.com/gremo/nest-winston)
Will print to `console` and to files in `logs/`.

In develop it will print all logs to Log Level `Debug` and in production to Log Level `Info`.

All **HTTP Requests** will be logged with **Custom Middleware**.

**BUG: When Module, Service or Controller is injected wrong, NestJS won`t log it due to the custom Logger Service.**

### Health-checks

[Health checks](https://docs.nestjs.com/recipes/terminus) are created to ensure that external services (like database) are available and can be accessed via `/health`.

### Rate Limiting

Global [Throttler](https://docs.nestjs.com/security/rate-limiting) can be configured in `.env`:

- THROTTLER_TTL -> the number of seconds that each request will last in storage
- THROTTLER_LIMIT -> the maximum number of requests within the TTL limit

### Validation

[Validation](https://docs.nestjs.com/techniques/validation) via DTO

- [Available Rules](https://github.com/typestack/class-validator#validation-decorators)
- [Available Transforms](https://github.com/typestack/class-transformer)

### Prisma

[Prisma](https://www.prisma.io/)
[Nest Prisma](https://docs.nestjs.com/recipes/prisma)

#### Migrations
[Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate) database with `npx prisma migrate dev --name ${__name__}`. Replace migration name `${__name__}`

#### Transactions
Use [Transactions](https://www.prisma.io/docs/concepts/components/prisma-client/transactions) with `prisma.$transaction([ ... ])`.

### Environment Variables

[Configuration](https://docs.nestjs.com/techniques/configuration)

---

## Documentation

### Full Documentation

Automatic Project Documentation with [Compodoc](https://docs.nestjs.com/recipes/documentation)

With `npm run doc:generate` you can generate the documentation for the current codebase.

And with `doc:serve` you can visit it on `http://localhost:4201`.

### API Documentation

Automatic API Documentation with [Swagger](https://docs.nestjs.com/openapi/introduction)

You can visit the API documentation under `/api` (Authorization is still required for secured endpoints).

**[CLI Plugin](https://docs.nestjs.com/openapi/cli-plugin) will automatically add decorators for the documentation.**

---

## Tests

No Tests yet ):

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
