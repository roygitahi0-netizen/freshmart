# FreshMart Backend — Status

## Overview
Flask + SQLAlchemy REST API powering the FreshMart neighborhood supermarket frontend. Built with SQLAlchemy ORM, Flask-Migrate for database migrations, marshmallow schemas for validation and serialization, bcrypt for password hashing, and JWT for authentication.

## Architecture
```
backend/
├── app/
│   ├── __init__.py          # App factory, extensions init (SQLAlchemy, Migrate, Bcrypt, JWT, CORS)
│   ├── migrations/          # Flask-Migrate version control
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py          # User model with bcrypt hashing
│   │   ├── product.py       # Product model
│   │   └── contact_message.py  # Contact message model
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user_schema.py   # Marshmallow schema for User
│   │   ├── product_schema.py  # Marshmallow schema for Product
│   │   ├── contact_schema.py  # Marshmallow schema for Contact
│   │   └── login_schema.py    # Marshmallow schema for login validation
│   └── routes/
│       ├── __init__.py
│       ├── auth.py          # /api/auth/register, /login, /logout, /me
│       ├── products.py      # /api/products CRUD + upload
│       └── contact.py       # /api/contact POST
├── seed.py                  # Seed admin + demo user + sample products
├── run.py                   # WSGI entry point
├── Pipfile
├── requirements.txt
├── .env.example
├── .gitignore
├── render.yaml              # Render deployment blueprint
└── README.md
```

## What's Built
- [x] SQLAlchemy models: User, Product, ContactMessage
- [x] Flask-Migrate for database version control and migrations
- [x] Marshmallow schemas for validation and serialization/deserialization
- [x] Bcrypt password hashing
- [x] JWT authentication: login, logout, me, register
- [x] Products CRUD with multipart image upload
- [x] Contact message endpoint
- [x] CORS enabled for frontend communication
- [x] Seed script with admin + demo user + sample products
- [x] Render deployment config
- [x] API contract matches frontend expectations exactly

## API Contract (matches frontend)
| Method | Endpoint | Purpose | Auth | Frontend file |
|--------|----------|---------|------|---------------|
| POST | /api/auth/register | {email, password} → {access_token, user} | No | src/api/auth.js |
| POST | /api/auth/login | {email, password} → {access_token, user} | No | src/api/auth.js |
| POST | /api/auth/logout | Bearer token → {msg} | Yes | src/api/auth.js |
| GET | /api/auth/me | Bearer token → {user} | Yes | src/api/auth.js |
| GET | /api/products | → {products: [...]} | No | src/api/products.js |
| GET | /api/products/:id | → {product: {...}} | No | src/api/products.js |
| POST | /api/products | multipart → {product} | Yes (admin) | src/api/products.js |
| POST | /api/products/:id/update | multipart → {product} | Yes (admin) | src/api/products.js |
| DELETE | /api/products/:id | Bearer token → {msg} | Yes (admin) | src/api/products.js |
| POST | /api/contact | {name,email,message} → {msg} | No | src/pages/Contact.jsx |

## How to Run Locally
```bash
cd freshmart-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

# Initialize migrations (only needed once)
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Seed the database (creates admin + demo user + sample products)
python seed.py

flask run
```

After seeding, two users are registered in the database:

| Email | Password | Role |
|-------|----------|------|
| admin@freshminimart.co.ke | admin123 | Admin |
| user@freshminimart.co.ke | user123 | Regular |

## Deploy to Render
1. Push this repo to GitHub
2. Go to https://render.com and sign in
3. Click **New → Blueprint** and select this repo
4. Render detects `render.yaml` and provisions the service + PostgreSQL database
5. The release command automatically runs `flask db upgrade` to apply migrations
6. After first deploy, run `python seed.py` to create admin and demo users
7. Set `JWT_SECRET_KEY` in Render dashboard (or use auto-generated value)
8. Deploy

## Frontend-Backend Communication
The frontend reads `VITE_API_BASE_URL` from `.env` and appends `/api` to every request. When `VITE_API_BASE_URL` is empty, the frontend uses local sample data. Set it to the Render backend URL (e.g., `https://freshmart-api.onrender.com`) to connect to the live backend.