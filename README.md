# Notes Management API

<!-- Typing animation -->

![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira%20Code&size=26&duration=2500&pause=1000&color=00CC66&background=00000000&center=true&width=720&height=48&lines=Notes+Management+API;Express+%2B+TypeScript;Prisma+%2B+Postgres)

<!-- Technology badges -->

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/Postgres-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

A small REST API for user registration/login and personal notes management built with Express, TypeScript, and Prisma (Postgres).

**Quick Summary**

- **Server entry**: `server.ts`
- **API base**: `/api`
- **Notes routes**: `/api/notes` (protected)
- **User routes**: `/api/user`
- **Database**: PostgreSQL (Prisma)

**Prerequisites**

- Node.js (v16+ recommended)
- npm
- PostgreSQL database

**Environment**
Create a `.env` file at the project root with the following variables:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_jwt_secret_here
PORT=3000
```

Make sure `DATABASE_URL` points to a running Postgres instance.

**Install**

```bash
npm install
```

**Prisma setup / Migrations**

If you haven't generated the client or applied migrations yet, run:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Notes:

- The project includes a `prisma/schema.prisma`. Adjust `DATABASE_URL` before running migrations.
- If you already have migrations in `prisma/migrations`, `migrate dev` will apply them.

**Run (development)**

```bash
npm run dev
```

This runs `nodemon` + `tsx` (see `package.json` script `dev`) and listens by default on the port defined in `PORT` or `3000`.

**Project structure (relevant files)**

- `server.ts` - Express app entry
- `routes/notesRoutes.ts` - Notes endpoints (protected by auth)
- `routes/userRoutes.ts` - User registration/login and profile
- `controllers/*.ts` - Route handlers
- `middlewares/authHandler.ts` - JWT auth middleware
- `lib/prisma.ts` - Prisma client initialization
- `prisma/schema.prisma` - Prisma models (User, Note)

**API Endpoints**

All endpoints are under `/api`.

**User**

- `POST /api/user/register` — Register a new user (public)

  - Body (application/json): `{ "name": "Alice", "email": "alice@example.com", "password": "secret" }`
  - Response: `{ id, name, email, token }`

- `POST /api/user/login` — Login (public)

  - Body: `{ "email": "alice@example.com", "password": "secret" }`
  - Response: `{ id, name, email, token }`

- `GET /api/user/current` — Get current user (private)

  - Header: `Authorization: Bearer <token>`
  - Response: JWT payload attached by middleware (id, name, email)

- `GET /api/user/profile` — Get user with their notes (private)
  - Header: `Authorization: Bearer <token>`
  - Response: `{ id, name, email, notes: [...] }`

**Notes (all protected — require `Authorization` header)**

- `GET /api/notes` — Get all notes for the authenticated user

  - Header: `Authorization: Bearer <token>`
  - Response: Array of note objects

- `GET /api/notes/:id` — Get a single note by id (only if owned by user)

  - Header: `Authorization: Bearer <token>`

- `POST /api/notes` — Create a new note

  - Header: `Authorization: Bearer <token>`
  - Body: `{ "title": "...", "content": "..." }`
  - Response: Created note object

- `PUT /api/notes/:id` — Update note (only if owned by user)

  - Header: `Authorization: Bearer <token>`
  - Body: `{ "title": "...", "content": "..." }`
  - Response: Updated note object

- `DELETE /api/notes/:id` — Delete note (only if owned by user)
  - Header: `Authorization: Bearer <token>`
  - Response: `{ message: "Note deleted successfully" }`

**Authentication (JWT)**

- The app issues a JWT on registration and login using `JWT_SECRET` from the environment.
- Protected routes expect the header:

```
Authorization: Bearer <token>
```

If the token is missing, invalid, or the user is not found, the middleware returns a `401` error.

**Sample curl flows**

1. Register:

```bash
curl -X POST http://localhost:3000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret"}'
```

2. Login:

```bash
curl -X POST http://localhost:3000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret"}'
```

Save the returned `token` and use it in subsequent requests.

3. Create a note:

```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"First note","content":"Hello world"}'
```

4. Get all notes:

```bash
curl -X GET http://localhost:3000/api/notes \
  -H "Authorization: Bearer <token>"
```

**Error handling**

- Errors are thrown in controllers and the `errorHandler` middleware formats responses. Typical HTTP status codes used: `400` (bad request), `401` (unauthorized), `403` (forbidden), `404` (not found), `500` (server error).

**Development notes & tips**

- The app uses `prisma` with the `@prisma/adapter-pg` adapter and `@prisma/client` generated into `generated/prisma`.
- If you update `prisma/schema.prisma`, run `npx prisma generate` and create/apply a migration with `npx prisma migrate dev`.
- Passwords are hashed using `bcryptjs`.
- Tokens expire in 1 hour (see `controllers/userControllers.ts`).

**Troubleshooting**

- If you see errors connecting to the DB, verify `DATABASE_URL` and that Postgres is reachable.
- If Prisma client errors reference `generated/prisma`, ensure you ran `npx prisma generate` successfully.

**Next steps / Improvements**

- Add request validation (e.g., `zod` or `Joi`) for stronger input validation.
- Add tests and CI pipeline.
- Add rate-limiting and stronger security headers for production.

---
