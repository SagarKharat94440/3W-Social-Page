# Mini Social Post Application

A full-stack social media application inspired by TaskPlanet's Social Page.

## Features

- User signup and login
- Create posts (text/image or both)
- Like and comment on posts
- Public feed with pagination
- Dark theme UI

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB

## Project Structure

```
├── backend/
│   ├── config/          # DB & Cloudinary config
│   ├── middleware/      # Auth middleware
│   ├── models/          # User & Post models
│   ├── routes/          # API routes
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/         # API calls
│   │   ├── components/  # React components
│   │   │   ├── Navbar/
│   │   │   ├── CreatePost/
│   │   │   ├── PostCard/
│   │   │   └── CommentSection/
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Page components
│   │   │   ├── Home/
│   │   │   ├── Login/
│   │   │   └── Register/
│   │   └── App.jsx
│   └── index.html
│
└── README.md
```

## Setup

### Backend

```bash
cd backend
npm install
# Create .env file from .env.example
npm run dev
```

### Frontend

```bash
cd frontend
npm install
# Create .env file from .env.example  
npm run dev
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-secret
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Deployment

- Frontend: Vercel/Netlify
- Backend: Render
- Database: MongoDB Atlas
