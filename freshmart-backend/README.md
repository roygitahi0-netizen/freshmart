# FreshMart Backend

Flask + SQLAlchemy REST API for the FreshMart neighborhood supermarket.

## Setup

```bash
cd freshmart-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python seed.py
flask run
```

## Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | No | Login with email + password |
| POST | /api/auth/logout | Yes | Logout (Bearer token) |
| GET | /api/auth/me | Yes | Get current user |
| GET | /api/products | No | List all products |
| GET | /api/products/:id | No | Get single product |
| POST | /api/products | Yes | Create product (multipart) |
| POST | /api/products/:id/update | Yes | Update product (multipart) |
| DELETE | /api/products/:id | Yes | Delete product |
| POST | /api/contact | No | Submit contact message |

## Deploy to Render

See `render.yaml` and `BACKEND_STATUS.md` for deployment instructions.