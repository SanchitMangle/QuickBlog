# 📝 QuickBlog - AI Powered Blogging Platform

A full-stack **Blogging Platform** built using **MongoDB, Express, React, and Node.js (MERN Stack)**.  
QuickBlog allows users to explore, read, and interact with blogs, while **Admins** can publish, manage, and moderate blogs.  
This project also integrates **AI (Google Gemini)** to generate blog content automatically.

---

## 📖 Overview

QuickBlog is a modern blogging platform where:
- Users can explore blogs and engage with content.
- Admins can create and manage blogs, and moderate comments.
- AI (Google Gemini) helps in **auto-generating blog content**.

It also features an **Admin Dashboard** for managing posts and comments seamlessly.

---

## 🛠️ Tech Stack

**Frontend:** React.js, Tailwind CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB, Mongoose  
**Authentication:** JWT (JSON Web Tokens)  
**AI Integration:** Google Gemini API  
**Hosting:** Vercel (Frontend), Render/Other (Backend)

---

## ✨ Features

### 🧑‍💻 Users
- Browse and read blogs
- Comment on blog posts
- Responsive UI for desktop and mobile

### 🛠️ Admin
- Create, edit, and delete blogs
- AI-generated blog content (via Google Gemini)
- Manage comments (approve/reject/remove)
- Dashboard for blog & comment management

### ⚙️ System Features
- AI integration for blog content generation
- Secure authentication for admin
- Optimized MERN stack architecture

---

## 🌐 Live Demo

🔗 **Live Site:** [QuickBlog](https://quick-blog-frontend-three.vercel.app/)  
📂 **GitHub Repo:** [QuickBlog Repository](https://github.com/SanchitMangle/QuickBlog)

---

## 🚀 Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/SanchitMangle/QuickBlog.git
cd QuickBlog
Install dependencies

bash
Copy
Edit
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
Setup environment variables

Create a .env file in both backend and frontend directories.

Backend .env

ini
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key
Frontend .env

ini
Copy
Edit
VITE_BACKEND_URL=http://localhost:5000
Run the application

bash
Copy
Edit
# Start backend
cd backend
npm run dev

# Start frontend
cd ../frontend
npm run dev
