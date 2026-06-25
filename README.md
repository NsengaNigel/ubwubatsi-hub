 Ubwubatsi Hub

A professional matching platform connecting homeowners and landowners with verified architects and civil engineers in Rwanda.

Live Demo
- **Frontend:** https://ubwubatsihub.netlify.app
- **Backend API:** https://ubwubatsi-hub.onrender.com

 Description
Ubwubatsi Hub is the first platform in Rwanda to convert government-verified professional credentials from RIA (Rwanda Institute of Architects) and Engineers Rwanda into a client-facing marketplace for private construction projects. Professionals cannot appear on the platform without submitting a registration number validated against these official directories.

Tech Stack
| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6, Socket.io Client |
| Backend | Node.js, Express.js v5, MongoDB Atlas, JWT, Socket.io, Cloudinary |
| Deployment | Netlify (frontend), Render (backend), MongoDB Atlas (database) |

Project Structure

ubwubatsi-hub/
├── frontend/src/
│   ├── api/          # Axios instance with JWT interceptor
│   ├── components/   # Navbar, Sidebar, ImageUpload, StarRating, Notifications
│   ├── context/      # AuthContext, SocketContext
│   └── pages/        # All screens including admin panel
├── backend/
│   ├── models/       # User, Professional, Project, Expression, Message, Rating, Notification
│   ├── routes/       # auth, users, projects, professionals, expressions, messages, ratings, upload, admin
│   ├── middleware/   # JWT auth + role verification
│   ├── utils/        # createNotification, socketIo singleton
│   └── server.js
└── README.md


 Local Setup

Requirements
- Node.js v18+, npm, MongoDB Atlas account, Cloudinary account

Steps

bash

Clone
git clone https://github.com/NsengaNigel/ubwubatsi-hub.git
cd ubwubatsi-hub

Backend

cd backend
npm install

Create .env

PORT=5000
MONGODB_URI=your_atlas_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173

Seed admin account

node seedAdmin.js

Start backend

node server.js

Frontend

cd ../frontend
npm install
npm run dev

Frontend runs at `http://localhost:5173`

Core Features

- **Registration-gated verification** — professionals validated against RIA and Engineers Rwanda before going live
- **KUBAKA integration** — automatic zoning reference link generated on every project posting
- **Expression of interest system** — professionals apply to projects, clients accept or reject
- **Project lifecycle** — open → in-progress → completed → reviewed
- **Real-time messaging** — Socket.io conversations tied to specific projects
- **Ratings and reviews** — star ratings with written reviews and auto-calculated averages
- **Real-time notifications** — instant alerts for all platform actions
- **Admin panel** — verification queue, user management, project management, analytics

API Summary

| Route | Endpoints |
|-------|-----------|
| `/api/auth` | register, login, me, change-password |
| `/api/projects` | CRUD + complete + active |
| `/api/professionals` | profile, certifications, browse |
| `/api/expressions` | express interest, accept, reject, withdraw |
| `/api/messages` | conversations, send, unread count |
| `/api/ratings` | submit, get by professional, can-rate check |
| `/api/notifications` | get, read, unread count, delete |
| `/api/upload` | profile picture, portfolio images |
| `/api/admin` | verify, users, projects, analytics |

Deployment


Frontend  → Netlify  (base: frontend, build: npm run build, publish: frontend/dist)
Backend   → Render   (root: backend, build: npm install, start: node server.js)
Images    → Cloudinary CDN

After deploying update `FRONTEND_URL` in Render and `baseURL` in `src/api/axios.js` to production URLs.

Implementation Analysis

SO1. MVP Prototype: Fully achieved, all core modules are implemented and live. Professional verification, project posting with KUBAKA reference link, live messaging, portfolio management and rating are all live. 

SO2. Pilot testing: Almost achieved, the app is deployed and ready for the pilot as the survey is also ready. The pilot tests will begin this week across the targeted areas.

SO3. KPI Evaluation: Almost achieved, all the necessary is in place retention via login timestamps, project initiation via expression acceptance rates, satisfaction via rating and post pilot survey, results pending from pilot testing

SO4 Recommendations: Not achieved

DEMO and SCREENSHOT folder link

https://drive.google.com/drive/folders/1m4py2nJzlcQf1iFLZFy25JOXyxerVpP9?usp=sharing



