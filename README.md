# QTicket — Role-Based Ticket Management System

A full-stack MERN application for managing support tickets with role-based access control.

## Live Links

| Service          | URL                                                   |
| ---------------- | ----------------------------------------------------- |
| Frontend         | https://q-ticket.vercel.app                           |
| Backend Base URL | https://q-ticket-production.up.railway.app            |
| Health Check     | https://q-ticket-production.up.railway.app/api/health |

## Test Credentials

| Role  | Email               | Password   |
| ----- | ------------------- | ---------- |
| Admin | john@qticket.com    | john1234   |
| Agent | emily@qticket.com   | emily123   |
| Agent | michael@qticket.com | michael123 |
| User  | sarah@qticket.com   | sarah123   |
| User  | james@qticket.com   | james123   |

## Tech Stack

| Layer          | Technology                                                     |
| -------------- | -------------------------------------------------------------- |
| Frontend       | React, Redux Toolkit, Axios, React Router, Tailwind CSS        |
| Backend        | Node.js, Express.js                                            |
| Database       | MongoDB, Mongoose                                              |
| Authentication | JWT                                                            |
| Deployment     | Railway (Backend), Vercel (Frontend), MongoDB Atlas (Database) |

## Features

- JWT based authentication and protected routes
- Role based access control (Admin, Agent, User)
- Support ticket creation, management and tracking
- Ticket assignment and status management
- Comments and status history on tickets
- Dashboard with role based statistics
- Search, filter, sort and pagination on ticket list
- User management with role and status control
- Responsive UI with clean minimal design

## Project Structure

```
q-ticket/
├── client/                   # React frontend
│   └── src/
│       ├── api/              # Axios API files
│       ├── app/              # Redux store
│       ├── components/       # Reusable components
│       │   ├── common/       # Shared UI components
│       │   ├── dashboard/    # Dashboard components
│       │   ├── layout/       # Sidebar, Navbar, Layout
│       │   └── tickets/      # Ticket components
│       ├── features/         # Redux slices
│       ├── pages/            # Page components
│       ├── routes/           # Protected and role routes
│       └── utils/            # Axios instance
└── server/                   # Node.js backend
    └── src/
        ├── config/           # Database config
        ├── controllers/      # Request handlers
        ├── middleware/        # Auth, role, validation
        ├── models/           # Mongoose models
        ├── routes/           # API routes
        ├── services/         # Business logic
        └── utils/            # API response helper
```

## Local Setup

### Prerequisites

- Node.js v18+
- MongoDB Atlas account

### Backend Setup

```bash
cd server
npm install
```

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

```bash
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

## API Summary

### Auth

| Method | Endpoint           | Access | Description       |
| ------ | ------------------ | ------ | ----------------- |
| POST   | /api/auth/register | Public | Register new user |
| POST   | /api/auth/login    | Public | Login user        |

### Tickets

| Method | Endpoint                  | Access       | Description      |
| ------ | ------------------------- | ------------ | ---------------- |
| POST   | /api/tickets              | Admin, User  | Create ticket    |
| GET    | /api/tickets              | All          | Get all tickets  |
| GET    | /api/tickets/:id          | All          | Get ticket by ID |
| PUT    | /api/tickets/:id          | Admin, User  | Update ticket    |
| DELETE | /api/tickets/:id          | Admin, User  | Delete ticket    |
| PATCH  | /api/tickets/:id/status   | Admin, Agent | Update status    |
| PATCH  | /api/tickets/:id/assign   | Admin        | Assign ticket    |
| POST   | /api/tickets/:id/comments | All          | Add comment      |

### Users

| Method | Endpoint              | Access | Description        |
| ------ | --------------------- | ------ | ------------------ |
| GET    | /api/users            | Admin  | Get all users      |
| GET    | /api/users/:id        | Admin  | Get user by ID     |
| PATCH  | /api/users/:id/status | Admin  | Toggle user status |
| PATCH  | /api/users/:id/role   | Admin  | Update user role   |

### Dashboard

| Method | Endpoint       | Access | Description         |
| ------ | -------------- | ------ | ------------------- |
| GET    | /api/dashboard | All    | Get dashboard stats |

## User Roles

| Role  | Permissions                                                               |
| ----- | ------------------------------------------------------------------------- |
| Admin | Full access — manage users, all tickets, assign, update status, dashboard |
| Agent | View assigned tickets, update status, add comments, dashboard             |
| User  | Create tickets, view own tickets, add comments, dashboard                 |

## Deployment

| Service  | Platform      |
| -------- | ------------- |
| Frontend | Vercel        |
| Backend  | Railway       |
| Database | MongoDB Atlas |

### Environment Variables (Production)

**Backend (Railway):**

```env
MONGO_URI=your_atlas_uri
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://q-ticket.vercel.app
NODE_ENV=production
```

**Frontend (Vercel):**

```env
VITE_API_URL=https://q-ticket-production.up.railway.app/api
```
