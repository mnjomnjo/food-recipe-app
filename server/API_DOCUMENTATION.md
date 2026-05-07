# API Documentation – Food Recipe App

## Base URL

Local development:

http://localhost:5000

---

## Authentication

Most recipe endpoints require a JWT token.

After login, copy the token and send it in the request header:

Authorization: Bearer YOUR_TOKEN_HERE

---

# Auth Endpoints

## Register User

POST /api/auth/register

### Body

```json
{
  "username": "wissamtest",
  "email": "wissamtest@example.com",
  "password": "123456"
}

Response
"User created successfully"

Login User
POST /api/auth/login

Body
{
  "email": "wissamtest@example.com",
  "password": "123456"
}
Response
{
  "message": "Login successful",
  "token": "JWT_TOKEN_HERE"
}
Recipe Endpoints
Create Recipe

POST /api/recipes

Body
{
  "title": "Grilled Chicken Salad",
  "description": "Light and healthy salad",
  "ingredients": ["chicken breast", "lettuce", "tomato", "olive oil"],
  "instructions": "Grill the chicken breast, chop vegetables, mix everything together, and add olive oil.",
  "calories": 250
}

Get Recipes
GET /api/recipes

Returns recipes that belong to the logged-in user.


Search Recipes
GET /api/recipes?search=chicken


Filter Recipes by Calories
GET /api/recipes?calories=low
GET /api/recipes?calories=medium
GET /api/recipes?calories=high


Calorie Levels
low → less than 300 calories
medium → 300–600 calories
high → more than 600 calories


Search + Filter
GET /api/recipes?search=chicken&calories=medium


Update Recipe
PUT /api/recipes/:id

Example:
PUT /api/recipes/RECIPE_ID_HERE


Delete Recipe
DELETE /api/recipes/:id

Example:
DELETE /api/recipes/RECIPE_ID_HERE

Rating Endpoint
Rate Recipe
POST /api/recipes/:id/rate

Body
{
  "rating": 5
}

Rating must be between 1 and 5.


Statistics Endpoint
Get Recipe Statistics
GET /api/recipes/stats

Example Response
{
  "totalRecipes": 7,
  "avgCalories": 607,
  "lowCalories": 1,
  "mediumCalories": 2,
  "highCalories": 4
}
Backend Features Implemented
Node.js and Express server
MongoDB Atlas connection
JWT authentication
Protected recipe routes
Recipe CRUD operations
Calories field
Recipe rating
Search functionality
Calorie filtering
Statistics API using MongoDB aggregation