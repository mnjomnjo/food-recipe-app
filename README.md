# 🍽️ Food Recipe App

## 📖 Overview

Food Recipe App is a fullstack web application developed using the MERN stack (MongoDB, Express.js, React.js, and Node.js).

The application allows users to register, log in, create recipes, manage their own recipes, rate recipes, save favorites, and securely access protected features.

This project was developed as part of the DA219B Fullstack Web Development course at Kristianstad University.

---

# 🚀 Current Features

## 🔐 Authentication & Security

* User registration and login
* JWT access tokens (15 min) with refresh tokens (httpOnly cookie, 7 days)
* Automatic token refresh on expired access tokens
* Logout (clears refresh cookie)
* Password hashing using bcrypt
* Protected API routes
* Admin authorization
* Helmet security middleware
* Express Rate Limiting
* CORS configured for the React client with credentials

## 🍲 Recipe Features

* Create recipes
* View recipes
* Update recipes
* Delete recipes
* Recipe ownership validation

## 🖥️ Frontend Integration (Axios)

The React client uses a **shared Axios instance** instead of calling `localhost:5000` directly in each page.

**Location:** `client/src/api/api.js`

| Feature | Description |
| -------- | ------------- |
| **Base URL** | `REACT_APP_API_URL` or `http://localhost:5000` |
| **Credentials** | `withCredentials: true` (sends refresh-token cookie) |
| **Auth header** | Attaches `Authorization: Bearer <token>` from `localStorage` on every request |
| **Auto refresh** | On `401`, calls `POST /api/auth/refresh`, stores new token, retries the failed request |
| **Logout redirect** | If refresh fails, clears token and redirects to login |

**Pages using the API client:**

| Page / Component | APIs used |
| ---------------- | --------- |
| `Login.jsx` | `POST /api/auth/login` |
| `Register.jsx` | `POST /api/auth/register` |
| `Navbar.jsx` | `POST /api/auth/logout` |
| `Home.jsx` | recipes list, favorites, rate, delete |
| `AddRecipe.jsx` | `POST /api/recipes` |
| `RecipeDetails.jsx` | recipes list, favorites toggle |
| `Favorites.jsx` | `GET /api/recipes/favorites/my`, remove favorite |

**Example usage in a component:**

```javascript
import api from "../api/api";

const res = await api.get("/api/recipes");
```

---

# 🛠️ Technologies Used

## Frontend

* React.js
* Axios (shared API client with interceptors)
* JavaScript
* CSS
* React Hot Toast

## Backend

* Node.js
* Express.js
* cookie-parser (refresh tokens)

## Database

* MongoDB
* Mongoose

## Security

* JWT (access + refresh)
* bcrypt
* Helmet
* Express Rate Limit

## Tools

* GitHub
* Postman / Thunder Client
* VS Code

---

# 📂 Project Structure

```bash
food-recipe-app/
│
├── client/
│   └── src/
│       ├── api/
│       │   └── api.js          # Shared Axios instance (auth + refresh)
│       ├── components/
│       └── pages/
│
├── server/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
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

Server runs on **http://localhost:5000**

---

# ▶️ Frontend Setup

```bash
cd client
npm install
npm start
```

---

# 🔑 Environment Variables

Create a `.env` file inside the **server** folder:

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

* Backend authentication, refresh tokens, and recipe APIs are implemented.
* Frontend is integrated with the backend through the shared **Axios API client** (`client/src/api/api.js`).
* Login, logout, token refresh, recipes CRUD (create/delete), favorites, and rating are wired in the UI.
* Remaining work: edit recipe (`PUT`), server-side search/stats, forgot/reset password, and admin dashboard.

---

# 📚 Course Information

Course: DA219B – Fullstack Web Development
Kristianstad University
