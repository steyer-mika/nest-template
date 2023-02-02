# Nest Template

## Setup for Development

### Requirements

- NPM
- Docker

### VS Code Extensions

- Prettier
- EsLint

### Step for Step Setup

1. Clone Nest Template in empty folder
2. Configure `.env`
    * Replace `APP_NAME` with project name
    * To generate `JWT_SECRET` use `node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"`
    * Adjust `MONGODB_URI`
    * Set `FRONTEND_URL`
3. Configure `.package.json` (name, version, ...)
4. Adjust `/client/index.html` (name)
5. Replace `/client/favicon.ico`
6. Install packages `npm install`
7. Run `npm run start:dev`

Optional: 
5. Open official NestJS Documentation `https://docs.nestjs.com/`

---

## Docker

If you don´t want to use the local MongoDB Server, you can use a Docker Image

1. Configure `.env` with `.env.docker`
2. Start docker with `docker-compose up dev -d`

For production you can use `docker-compose up prod -d`

---

## Authorization

### Security Endpoints

[JWT](https://docs.nestjs.com/security/authentication)

Every Endpoint is secured by default. To disable this behavior you can use the `@Public` decorator on the controller.

To access the secured endpoints you need a `Authorization Bearer Token` in the request headers.

On `auth/login` you can post your `email` and `password` in return you get __accessToken__ and __refreshToken__.

Access Token is the Authorization Bearer Token

And with the Refresh Token you can refresh the Access Token on `auth/refresh` with Method POST and Body `refreshToken`

### Role Authority

[CASL](https://casl.js.org/v6/en/)

In CASL there every Schema is an __Subject__.
Every Subject has multiple __Actions__ (default CURD Methods and Manage that represents all Actions).

**A user gets access to various actions on a subject based on there role.**

### Verify Email

After a user has registered or the endpoint `/auth/send-email-verification` has been called, an e-mail to verify the e-mail address is sent via an smtp server.

Email Template can be edited under `src/mail/templates/*.hbs` and the frontend endpoints can be configured in `src/config/endpoints.ts`.

To verify the users email call `/auth/verify-email`.

**Note: All endpoints that are not GET requests cannot be called as long as the email is not verified**

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
Serves all files in `client`

### Seeder

[NestJS Seeder](https://www.npmjs.com/package/nestjs-seeder)
In the Schema you can add `@Factory()` decorator witch will define the fake data of the attribute.

In `src/seeder` you can register the Schema for the Seeder.

### Logger

[Custom Logger](https://docs.nestjs.com/techniques/logger) Service with [winston](https://github.com/gremo/nest-winston)
Will print to `console` and to files in `logs/`

In develop it will print all logs to Log Level `Debug` and in production to Log Level `Info`

All **HTTP Requests** will be logged with __Custom Middleware__.

**BUG: When Module, Service or Controller is injected wrong, NestJS won`t log it due to the custom Logger Service.**

### Health-checks

[Health checks](https://docs.nestjs.com/recipes/terminus) are created to ensure that external services (like database) are available and can be accessed via `/health`

### Rate Limiting

Global [Throttler](https://docs.nestjs.com/security/rate-limiting) can be configured in `.env`:  

* THROTTLER_TTL -> the number of seconds that each request will last in storage
* THROTTLER_LIMIT -> the maximum number of requests within the TTL limit

### Validation

[Validation](https://docs.nestjs.com/techniques/validation) via DTO

* [Available Rules](https://github.com/typestack/class-validator#validation-decorators)
* [Available Transforms](https://github.com/typestack/class-transformer)

### MongoDB

[Mongoose](https://docs.nestjs.com/recipes/mongodb)
[Mongodb](https://docs.nestjs.com/techniques/mongodb)

### Environment Variables

[Configuration](https://docs.nestjs.com/techniques/configuration)

---

## Documentation

### Full Documentation

Automatic Project Documentation with [Compodoc](https://docs.nestjs.com/recipes/documentation)

With `npm run doc:generate` you can generate the documentation for the current codebase

And with `doc:serve` you can visit it on `http://localhost:4201`

### API Documentation

Automatic API Documentation with [Swagger](https://docs.nestjs.com/openapi/introduction)

You can visit the API documentation under `/api` (Authorization is still required for secured endpoints)

**[CLI Plugin](https://docs.nestjs.com/openapi/cli-plugin) will automatically add decorators for the documentation**

---

## Tests

No Tests yet ):

## CLI

NestJS comes with a powerful [CLI Tool](https://docs.nestjs.com/cli/overview).

But to generate CURDs you can use [Custom NestJS Template CLI](https://github.com/steyer-mika/nest-cli). This CLI is specifically designed to create CURDs for this __NestJS Template__.

## Techniques

### Events

[Events](https://docs.nestjs.com/techniques/events)

### Microservices

[Microservices](https://docs.nestjs.com/microservices/basics)

### Lifecycle

[Lifecycle](https://docs.nestjs.com/fundamentals/lifecycle-events)

### MongoDB Hooks

[MongoDB Hooks](https://docs.nestjs.com/techniques/mongodb#hooks-middleware)

### File Upload

[File Upload](https://docs.nestjs.com/techniques/file-upload)

### Caching

[Caching](https://docs.nestjs.com/techniques/caching)
