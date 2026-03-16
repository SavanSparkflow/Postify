# Postify AI - Full Stack AI Post Generator

Postify AI is a full-stack MERN Web Application that leverages the HuggingFace Inference API (Mistral-7B-Instruct) to effortlessly generate detailed and engaging posts for various social media platforms.

## Folder Architecture

```text
Postify AI/
├── client/          # Frontend (React + Vite + Tailwind CSS)
│   ├── .env
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React Context for state (Auth)
│   │   ├── pages/       # Different route pages
│   │   ├── services/    # API and Axios setup
│   │   ├── App.jsx      # Router & Layout
│   │   └── main.jsx     # Entry point
│   ├── tailwind.config.js
│   └── vite.config.js
└── server/          # Backend (Node + Express + MongoDB)
    ├── .env
    ├── config/      # DB connection
    ├── controllers/ # Route logic handlers
    ├── middleware/  # Auth and error middleware
    ├── models/      # Mongoose schemas
    ├── routes/      # Express routes
    ├── utils/       # AI external services setup
    └── server.js    # Entry point
```

## Features
- **Authentication**: Secure JWT-based registration and login functionality.
- **AI Content Generator**: Generate customized posts with parameters: "One-line Idea", "Platform" (LinkedIn, Twitter, Blog, Instagram), and "Tone".
- **Advanced Dashboard UI**: Premium TailwindCSS UI with glassmorphism, responsive grids, load skeletons, gradients, and micro-animations.
- **Post History**: Save all previous user generations in MongoDB. Access them later on the "History" page.
- **Post Actions**: Quickly download outputs as `.txt`, copy to clipboard, or direct share to external platforms (Whatsapp, LinkedIn, Twitter).

## Development Setup

### Backend
1. `cd server`
2. `npm install`
3. Setup variables in `.env` (MongoDB URL, Hugging Face Token, JWT Secret).
4. Run server: `npm run dev` or `node server.js`

### Frontend
1. `cd client`
2. `npm install`
3. Setup variable in `.env` (`VITE_API_URL`).
4. Run client: `npm run dev`

## Deployment Guide

### Deploying the Backend (Render)
1. Push your code to GitHub.
2. Sign up on [Render.com](https://render.com).
3. Click "New Web Service" and connect your GitHub repository.
4. Set the Root Directory to `server`.
5. Build Command: `npm install`
6. Start Command: `node server.js`
7. Add Environment Variables:
   - `PORT`: (Render uses the default)
   - `MONGO_URI`: `Your MongoDB Atlas Connection String`
   - `JWT_SECRET`: `Your strong JWT secret`
   - `HUGGINGFACE_API_KEY`: `Your HuggingFace API key`
   - `FRONTEND_URL`: `Your frontend production URL`

### Deploying the Frontend (Vercel)
1. Sign up on [Vercel](https://vercel.com).
2. Click "Add New Project" and connect your GitHub repo.
3. Configure project: 
   - Framework preset: Vite
   - Root directory: `client`
4. Add Environment Variable:
   - `VITE_API_URL`: Your rendered backend URL (e.g., `https://postify-ai-api.onrender.com/api`).
5. Click "Deploy". Your MERN application is now live!
