Ubwubatsi Hub

A professional matching platform connecting homeowners and landowners with verified architects and civil engineers in Rwanda.

 Description

Ubwubatsi Hub addresses a critical gap in Rwanda's construction sector — there is no platform where private individuals and small developers can safely evaluate and engage with verified architects and civil engineers for their private construction projects. The platform introduces registration-number-gated professional verification anchored to Rwanda's two official government directories, RIA (Rwanda Institute of Architects) and Engineers Rwanda, making it the first platform to convert government-verified credentials into a client-facing marketplace for private construction projects.

 GitHub Repository

https://github.com/NsengaNigel/ubwubatsi-hub.git

 Tech Stack

Frontend
- HTML5, CSS3, JavaScript
- Tailwind CSS via CDN
- Google Fonts and Material Symbols

Backend
- Node.js + Express.js v5
- MongoDB Atlas + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

 Project Structure

```
ubwubatsi-hub/
├── frontend/
│   ├── index.html
│   ├── register.html
│   ├── login.html
│   ├── client-dashboard.html
│   ├── post-project.html
│   ├── browse-professionals.html
│   ├── professional-profile.html
│   └── professional-dashboard.html
├── backend/
│   ├── server.js
│   ├── routes/
│   │   └── auth.js
│   ├── models/
│   │   └── User.js
│   ├── middleware/
│   │   └── auth.js
│   └── .env
└── README.md
```

 Setup Instructions

Prerequisites
- Node.js v18 or higher
- npm
- MongoDB Atlas account

1. Clone the repository
```bash
https://github.com/NsengaNigel/ubwubatsi-hub.git
cd ubwubatsi-hub
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Configure environment variables

Create a `.env` file in the backend folder with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
```

4. Run the backend
```bash
node server.js
```

Expected output:
```
Server running on port 5000
MongoDB Atlas connected successfully
```

5. Run the frontend

Open `frontend/index.html` in your browser using Live Server in VS Code.

 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

Register body
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "0789123456",
  "password": "password123",
  "role": "client",
  "registrationNumber": "RIA-2024-001"
}
```

Login body
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

 Database Schema

| Field | Type | Description |
|-------|------|-------------|
| fullName | String | User's full name |
| email | String | Unique email address |
| phone | String | Phone number |
| password | String | Hashed password |
| role | String | Client or professional |
| registrationNumber | String | RIA or Engineers Rwanda number |
| isVerified | Boolean | Admin verification status |
| createdAt | Date | Account creation date |

 Screens

1. Landing page
2. Register with role-based selection
3. Login
4. Client dashboard
5. Post a project with KUBAKA reference link
6. Browse verified professionals
7. Professional profile with portfolio
8. Professional dashboard

 Unique Features

- Registration-number-gated professional onboarding validated against RIA and Engineers Rwanda
- KUBAKA reference link generated on project posting for zoning and regulatory context
- Two-sided marketplace with separate flows for clients and professionals

 Deployment Plan

| Layer | Platform | Status |
|-------|----------|--------|
| Frontend | Netlify | Planned |
| Backend | Render | Planned |
| Database | MongoDB Atlas | Active |

