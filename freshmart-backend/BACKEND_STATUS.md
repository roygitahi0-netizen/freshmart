# FreshMart Backend — Status

## Overview
Flask + SQLAlchemy REST API powering the FreshMart neighborhood supermarket frontend. Built with marshmallow schemas for validation and serialization, bcrypt for password hashing, and JWT for authentication.

## Architecture
```
freshmart-backend/
├── app/
│   ├── __init__.py          # App factory, extensions init
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
│       ├── auth.py          # /api/auth/login, /logout, /me
│       ├── products.py      # /api/products CRUD + upload
│       └── contact.py       # /api/contact POST
├── seed.py                  # Seed admin, demo user, sample products
├── run.py                   # WSGI entry point
├── requirements.txt
├── .env.example
├── render.yaml              # Render deployment blueprint
└── README.md
```

## What's Built
- [x] SQLAlchemy models: User, Product, ContactMessage
- [x] Marshmallow schemas for validation and serialization/deserialization
- [x] Bcrypt password hashing
- [x] JWT authentication: login, logout, me
- [x] Products CRUD with multipart image upload
- [x] Contact message endpoint
- [x] CORS enabled for frontend communication
- [x] Seed script with admin + demo user + sample products
- [x] Render deployment config
- [x] API contract matches frontend expectations exactly

## API Contract (matches frontend)
| Method | Endpoint | Purpose | Frontend file |
|--------|----------|---------|---------------|
| POST | /api/auth/login | {email, password} → {access_token, user} | src/api/auth.js |
| POST | /api/auth/logout | Bearer token → {msg} | src/api/auth.js |
| GET | /api/auth/me | Bearer token → {user} | src/api/auth.js |
| GET | /api/products | → {products: [...]} | src/api/products.js |
| GET | /api/products/:id | → {product: {...}} | src/api/products.js |
| POST | /api/products | multipart → {product} | src/api/products.js |
| POST | /api/products/:id/update | multipart → {product} | src/api/products.js |
| DELETE | /api/products/:id | Bearer token → {msg} | src/api/products.js |
| POST | /api/contact | {name,email,message} → {msg} | src/pages/Contact.jsx |

## How to Run Locally
```bash
cd freshmart-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python seed.py
flask run
```

## Deploy to Render
1. Push this repo to GitHub
2. Go to https://render.com and sign in
3. Click **New → Blueprint** and select this repo
4. Render detects `render.yaml` and provisions the service + database
5. Set `JWT_SECRET_KEY` and `DATABASE_URL` in Render dashboard
6. Deploy

## Frontend-Backend Communication
The frontend reads `VITE_API_BASE_URL` from `.env` and appends `/api` to every request. When `VITE_API_BASE_URL` is empty, the frontend uses local sample data. Set it to the Render backend URL (e.g., `https://freshmart-api.onrender.com`) to connect to the live backend.