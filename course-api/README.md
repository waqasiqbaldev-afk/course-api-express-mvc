# Course API — Express.js + Modular MVC

REST API with JWT authentication, Category CRUD and Course CRUD.

## Setup
```bash
npm install
cp .env.example .env     # then edit JWT_SECRET / MONGO_URI
npm run dev              # or: npm start
```
Requires Node 18+ and a running MongoDB (local or Atlas).

## Structure
```
server.js              entry point (DB connect + listen)
src/
  app.js               express app, routes, 404 + error handler
  config/db.js         MongoDB connection
  models/              User, Category, Course        (M)
  controllers/         business logic                (C)
  routes/              URL -> controller mapping     (V/routing layer)
  middleware/          auth (JWT), validate, error
  utils/               ApiError, asyncHandler
```

## Endpoints
| Method | URL | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | – | Register (name, email, password) |
| POST | /api/auth/login | – | Login, returns JWT |
| GET | /api/auth/me | Bearer | Current user |
| POST | /api/categories | Bearer | Create category (201) |
| GET | /api/categories | – | List categories (200) |
| GET | /api/categories/:id | – | Single category |
| PUT | /api/categories/:id | Bearer | Update category |
| DELETE | /api/categories/:id | Bearer | Delete (409 if it has courses) |
| POST | /api/courses | Bearer | Create course |
| GET | /api/courses | – | List (`?category=<id>&search=text`) |
| GET | /api/courses/:id | – | Single course |
| PUT | /api/courses/:id | Bearer | Update course |
| DELETE | /api/courses/:id | Bearer | Delete course |

Protected routes need header: `Authorization: Bearer <token>`

## Status codes used
200 OK · 201 Created · 400 Validation error · 401 Unauthorized · 404 Not found / invalid ID / unknown route · 409 Conflict (duplicate)

## Sample bodies
Register: `{ "name": "Ali Khan", "email": "ali@example.com", "password": "secret123" }`
Category: `{ "name": "Web Development", "description": "Frontend and backend courses" }`
Course: `{ "title": "Node.js Basics", "description": "Learn Express and MongoDB", "price": 49.99, "duration": "6 weeks", "instructor": "Sara Ahmed", "category": "<categoryId>" }`

## Postman evidence checklist
1. POST /api/auth/register -> 201, then POST /api/auth/login -> 200 (two screenshots or one page)
2. POST /api/categories (with Bearer token + JSON body) -> 201 Created
3. GET /api/categories -> 200 OK
4. POST /api/categories with `{}` body (or missing `name`) -> 400 Bad Request
5. GET /api/categories/123 or GET /api/unknown -> 404

Tips: each screenshot must show the URL bar, method, Headers tab, status code and response body.
Write your Name and Roll No at the top of each page.
