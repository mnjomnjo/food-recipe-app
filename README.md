# 🍽️ Food Recipe App

## 📖 Overview

Food Recipe App is a fullstack web application developed using the MERN stack (MongoDB, Express.js, React.js, and Node.js).

The application allows users to register, log in, create recipes, manage their own recipes, and securely access protected features.

This project was developed as part of the DA219B Fullstack Web Development course at Kristianstad University.

---

# 🚀 Current Features

## 🔐 Authentication & Security

* User registration and login
* JWT authentication
* Password hashing using bcrypt
* Protected API routes
* Admin authorization
* Helmet security middleware
* Express Rate Limiting

## 🍲 Recipe Features

* Create recipes
* View recipes
* Update recipes
* Delete recipes
* Recipe ownership validation

---

# 🛠️ Technologies Used

## Frontend

* React.js
* JavaScript
* CSS

## Backend

* Node.js
* Express.js

## Database

* MongoDB
* Mongoose

## Security

* JWT
* bcrypt
* Helmet
* Express Rate Limit

## Tools

* GitHub
* Thunder Client
* VS Code

---

# 📂 Project Structure

```bash
food-recipe-app/
│
├── client/
│
├── server/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation

## Clone the repository

```bash
git clone https://github.com/mnjomnjo/food-recipe-app.git
```

---

# ▶️ Backend Setup

```bash
cd server
npm install
node index.js
```

---

# ▶️ Frontend Setup

```bash
cd client
npm install
npm start
```

---

# 🔑 Environment Variables

Create a `.env` file inside the server folder:

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=5000
```

---

# 🔗 API Routes

## Authentication

* POST /api/auth/register
* POST /api/auth/login

## Recipes

* GET /api/recipes
* POST /api/recipes
* PUT /api/recipes/:id
* DELETE /api/recipes/:id

## Admin

* GET /api/admin
* GET /api/stats

---

# 👥 Team Members

| Name               | Role                      |
| ------------------ | ------------------------- |
| Mohammed Nour Jned | Authentication & Security |
| Tasnem             | Frontend Development      |
| Wisam              | Backend Development       |
| Ali                | Database Engineering      |
| Tharaki            | Integration & Deployment  |

---

# 📌 Current Project Status

The backend authentication and security system has been implemented successfully.

Additional frontend features and deployment improvements are still under development.

---

# 📚 Course Information

Course: DA219B – Fullstack Web Development
Kristianstad University
