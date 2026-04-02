# AI ToDo App (React + Vite, Node.js + Express, MongoDB)

## Prerequisites
- Node.js 20.x
- MongoDB running locally (default port 27017)

## Backend Setup
1. Open a terminal in `backend/` and create a `.env` file:
```
MONGO_URI=mongodb://127.0.0.1:27017/todo_app
JWT_SECRET=supersecretchangeme
COOKIE_NAME=auth_token
CLIENT_ORIGIN=http://localhost:5173
PORT=4000
```
2. Install deps (already installed if you used the script):
```
npm install
```
3. Run the API:
```
npm run dev
```
- API base URL: `http://localhost:4000/api`
- Health: `GET /api/health`

## Frontend Setup
1. Open a terminal in `frontend/` and install deps:
```
npm install
```
2. Start the dev server:
```
npm run dev
```
- App URL: `http://localhost:5173`

## Auth Flow
- Register: `POST /api/auth/register` (email, password)
- Login: `POST /api/auth/login` (email, password) -> sets httpOnly cookie
- Current user: `GET /api/auth/me`
- Logout: `POST /api/auth/logout`

## Todos
- List: `GET /api/todos`
- Create: `POST /api/todos` (title)
- Update: `PUT /api/todos/:id` (title?, completed?)
- Delete: `DELETE /api/todos/:id`

## Notes
- Only authenticated users can access `/api/todos/*`.
- Frontend uses dark AI theme (purple accents) and is mobile responsive.
- Cookies are httpOnly and sent via `withCredentials` from the frontend.
