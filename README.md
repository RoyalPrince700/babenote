# BabeLove

A full-stack platform for creating and sharing personalized love pages. Users sign up, pick a template (marriage proposal, love letter, love message, I miss you, or full love story), customize it with their babe's name and personal words, choose a **dark** or **light** theme, and share a unique link.

## Features

- User accounts (register / login)
- 10 templates — 5 categories × 2 themes (dark & light)
- Live preview editor while customizing
- Shareable public links (`/p/your-share-id`)
- Dashboard to manage all your creations
- Framer Motion animations + Lucide icons

## Template categories

| Category | Description |
|----------|-------------|
| Love Story | Full page with memories, bond, and love letter |
| Love Letter | Handwritten-style letter |
| Love Message | Short sweet note |
| Marriage Proposal | Pop the question in style |
| I Miss You | Emotional distance note |

## Tech stack

- **Frontend:** React, Vite, React Router, Framer Motion, Lucide React
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT

## Project structure

```
babe/
├── frontend/          # React app (platform + templates)
├── backend/           # Express API + MongoDB
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MongoDB](https://www.mongodb.com/) running locally, or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string

## Setup

### 1. Backend

```powershell
cd backend
copy .env.example .env
npm install
npm run seed
npm run dev
```

The API runs at **http://localhost:5000**

### 2. Frontend

Open a new terminal:

```powershell
cd frontend
npm install
npm run dev
```

The app runs at **http://localhost:5173**

## Environment variables

Backend (`backend/.env`):

| Variable | Description |
|----------|-------------|
| `PORT` | API port (default `5000`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for auth tokens |
| `CLIENT_URL` | Frontend URL for CORS |

## API overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Log in |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/templates` | No | List templates (`?category=&theme=`) |
| GET | `/api/templates/:slug` | No | Single template |
| GET | `/api/creations/public/:shareId` | No | Public shared page |
| GET | `/api/creations` | Yes | User's creations |
| POST | `/api/creations` | Yes | Save new creation |
| PUT | `/api/creations/:id` | Yes | Update creation |
| DELETE | `/api/creations/:id` | Yes | Delete creation |

## User flow

1. **Sign up** at `/register`
2. **Browse templates** at `/templates` — filter by category or dark/light theme
3. **Customize** — edit names, messages, memories, etc. with live preview
4. **Save** — get a share link like `http://localhost:5173/p/abc123xyz`
5. **Send** the link to your babe
6. **Manage** all pages from `/dashboard`

## Production build

```powershell
cd frontend
npm run build
```

Serve the `frontend/dist` folder with any static host. Point the frontend API calls to your deployed backend (update Vite proxy or use an env-based API URL).

## License

Private — built with love.
