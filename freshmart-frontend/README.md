# FreshMart — Full Stack

A React + Tailwind CSS frontend with a Flask + SQLAlchemy backend for a neighborhood supermarket. The storefront has public pages for browsing products and finding the store, plus an authenticated admin area for managing the product catalog.

## Project Structure

```
freshmart/
├── freshmart-frontend/     # React + Vite frontend
│   ├── src/
│   ├── package.json
│   └── ...
├── freshmart-backend/      # Flask + SQLAlchemy backend
│   ├── app/
│   │   ├── __init__.py     # App factory, extensions init
│   │   ├── models/         # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── product.py
│   │   │   └── contact_message.py
│   │   ├── schemas/        # Marshmallow schemas for validation & serialization
│   │   │   ├── user_schema.py
│   │   │   ├── product_schema.py
│   │   │   ├── contact_schema.py
│   │   │   └── login_schema.py
│   │   └── routes/         # API route handlers
│   │       ├── auth.py
│   │       ├── products.py
│   │       └── contact.py
│   ├── seed.py             # Seed admin, demo user, sample products
│   ├── run.py              # WSGI entry point
│   ├── requirements.txt
│   ├── .env.example
│   ├── render.yaml         # Render deployment blueprint
│   └── BACKEND_STATUS.md   # Backend progress & API docs
├── .gitignore
└── README.md               # You are here
```

---

## 1. What's included

- Public storefront: home, full product catalog with search/filter, single
  product page, and a contact page with store info + an embedded map.
- Admin area (route-protected): dashboard, product list with edit/delete,
  and an add/edit product form with photo upload and an in‑stock toggle.
- A login page wired to call your backend's `/auth/login` endpoint.
- A single `VITE_API_BASE_URL` environment variable that every API call in
  the app is built from — point it at your backend and the whole app goes
  live.
- Until that variable is set, the app runs in **preview mode**: product
  pages show local sample data so you (or the client) can review the UI
  without a backend running.

## 2. Tech stack

### Frontend

| Purpose        | Library                     |
|-----------------|------------------------------|
| UI framework    | React 19 (Vite)              |
| Styling         | Tailwind CSS 3               |
| Routing         | React Router 7               |
| Icons           | lucide-react                 |
| Map             | react-leaflet + OpenStreetMap (no API key needed) |

### Backend

| Purpose              | Library                          |
|-----------------------|----------------------------------|
| Web framework         | Flask 2.3                        |
| ORM                   | SQLAlchemy                       |
| Validation & serialization | Marshmallow + marshmallow-sqlalchemy |
| Password hashing      | Bcrypt (Flask-Bcrypt)            |
| Auth                  | Flask-JWT-Extended               |
| CORS                  | Flask-CORS                       |
| Deployment            | Render (Python service)          |

## 3. Getting started

### Frontend

```bash
cd freshmart-frontend
npm install
cp .env.example .env      # then fill in VITE_API_BASE_URL when your backend is ready
npm run dev                # http://localhost:5173
```

Build for production:

```bash
npm run build     # outputs to /dist
npm run preview   # serve the production build locally
```

### Backend

```bash
cd freshmart-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python seed.py
flask run
```

The backend runs on `http://localhost:5000` by default. Set `VITE_API_BASE_URL=http://localhost:5000` in the frontend `.env` to connect.

## 4. Connecting your Flask backend

This frontend is written to match a **Flask + SQLAlchemy** API, using
**Flask-JWT-Extended** for auth and **Marshmallow** for request validation.
Everything routes through `VITE_API_BASE_URL` in `.env`, with `/api`
appended automatically by `src/api/client.js`:

```
VITE_API_BASE_URL=http://localhost:5000
```

### Expected endpoints

| Method | Endpoint                    | Purpose                                              |
|--------|-------------------------------|--------------------------------------------------------|
| POST   | `/api/auth/login`              | `{ email, password }` → `{ access_token, user }`      |
| POST   | `/api/auth/logout`             | Bearer token → `{ msg }`                              |
| GET    | `/api/auth/me`                  | Bearer token → `{ user }`                             |
| GET    | `/api/products`                 | → `{ products: [...] }`                               |
| GET    | `/api/products/:id`             | → `{ product: {...} }`                                |
| POST   | `/api/products`                 | `multipart/form-data` (image + fields) → `{ product: {...} }` |
| POST   | `/api/products/:id/update`      | `multipart/form-data` → `{ product: {...} }`           |
| DELETE | `/api/products/:id`             | Bearer token → `{ msg }`                              |
| POST   | `/api/contact`                  | `{ name, email, message }` → `{ msg }`                |

A few Flask-specific conventions baked into `src/api/*`:

- **Auth token key** — Flask-JWT-Extended's `create_access_token()` is
  returned under `access_token`, not `token`. `src/api/auth.js` normalizes
  this to `{ token, user }` so the rest of the app doesn't care.
- **Bearer header** — every authenticated request sends
  `Authorization: Bearer <token>`, matching `@jwt_required()`.
- **Multipart uploads use POST, not PUT** — Flask's `request.files` parsing
  is unreliable with `PUT` + multipart in some WSGI setups, so product
  updates hit `POST /api/products/:id/update` instead of `PUT`. If your
  Flask routes handle `PUT` + multipart fine, change the path in
  `src/api/products.js`'s `updateProduct()`.
- **snake_case ↔ camelCase** — SQLAlchemy models typically serialize as
  snake_case (`in_stock`, `image_url`). `src/api/products.js` maps that to
  the camelCase shape (`inStock`, `image`) the React components use, both
  when reading responses and when building the `FormData` sent back.

**SQLAlchemy `Product` model fields** the API is expected to expose:

```json
{
  "id": 1,
  "name": "Vine-Ripened Tomatoes",
  "category": "Produce",
  "price": 2.49,
  "unit": "kg",
  "image_url": "/static/uploads/tomatoes.jpg",
  "in_stock": true,
  "description": "Locally sourced, picked fresh this morning."
}
```

`image_url` can be a relative path (served from Flask's `/static`, as
above) or a full URL (e.g. S3) — `src/api/products.js` handles both.

### Marshmallow validation errors

When a Marshmallow schema's `.load()` raises a `ValidationError`, this app
expects the error handler to return it under an `errors` key, keyed by
field name — the default shape of `ValidationError.messages`:

```python
from marshmallow import ValidationError

@app.errorhandler(ValidationError)
def handle_validation_error(err):
    return jsonify({"errors": err.messages}), 400
```

```json
{
  "errors": {
    "email": ["Not a valid email address."],
    "price": ["Must be greater than 0."]
  }
}
```

`src/api/client.js` detects this shape automatically (via the `ApiError`
class) and exposes it as `err.fieldErrors`. The login form and the
add/edit product form both read `fieldErrors` and show the message inline
under the matching input — see `src/components/FieldError.jsx`.

If your handler returns errors in a different shape (e.g. nested under
`errors.json` the way `webargs` does), adjust `parseErrorPayload()` in
`src/api/client.js` — that's the single place all error parsing happens.

Until `VITE_API_BASE_URL` is set, `src/api/products.js` falls back to the
sample data in `src/data/sampleProducts.js` so the storefront still renders.
Once you add the URL, that fallback is skipped automatically — no code
changes needed to "go live."

## 5. Authentication

- `src/context/AuthContext.jsx` holds the logged-in admin's JWT and user,
  persisted to `localStorage` so a refresh doesn't log them out. It also
  exposes `error` (a plain message) and `fieldErrors` (Marshmallow's
  per-field messages, if the login schema rejected the request).
- `src/components/ProtectedRoute.jsx` guards every `/admin/*` route and
  redirects to `/login` if there's no token.
- `src/api/auth.js` is the only file that knows the token comes back as
  `access_token` — if you switch away from Flask-JWT-Extended, that's the
  one line to change.

## 6. The map (Contact page)

The map uses **Leaflet + OpenStreetMap**, which needs no API key and works
out of the box. The store coordinates live in `src/components/StoreMap.jsx`:

```js
const STORE_POSITION = [-1.2833, 36.8236]; // [latitude, longitude]
```

Update those coordinates to your real store location.

**Using Google Maps instead:** if you'd rather use the Google Maps API,
replace the contents of `StoreMap.jsx` with a Google Maps Embed iframe or
the `@react-google-maps/api` package, and add your API key as
`VITE_GOOGLE_MAPS_API_KEY` in `.env`. The rest of the Contact page doesn't
need to change — it just renders `<StoreMap />`.

## 7. Project structure

### Frontend

```
freshmart-frontend/src/
├── api/                  # All backend communication lives here
│   ├── client.js         # Shared fetch wrapper (adds base URL + auth header)
│   ├── auth.js            # login / logout / fetchCurrentUser
│   └── products.js        # CRUD calls for products (with preview fallback)
│
├── context/
│   └── AuthContext.jsx    # Logged-in admin state, token persistence
│
├── components/
│   ├── Navbar.jsx          # Top nav, shows Admin Login or Dashboard link
│   ├── Footer.jsx           # Site footer with contact summary
│   ├── ProductCard.jsx      # "Crate tag" product card used in grids
│   ├── StockBadge.jsx       # In Stock / Sold Out stamp badge
│   ├── StoreMap.jsx          # Leaflet map for the Contact page
│   ├── ProtectedRoute.jsx    # Redirects to /login if not authenticated
│   └── Loader.jsx             # Loading state shown while fetching data
│
├── data/
│   └── sampleProducts.js    # Local preview data (used until backend is live)
│
├── pages/
│   ├── Home.jsx               # Landing page / hero / featured products
│   ├── Products.jsx           # Full catalog with search + filters
│   ├── ProductDetail.jsx      # Single product page
│   ├── Contact.jsx             # Store info + map + contact form (UI only)
│   ├── Login.jsx                # Admin login
│   ├── NotFound.jsx             # 404 page
│   └── admin/
│       ├── Dashboard.jsx         # Admin overview + stock stats
│       ├── ManageProducts.jsx    # Product table with edit/delete
│       └── ProductForm.jsx       # Shared add/edit product form
│
├── App.jsx                  # All routes are defined here
├── main.jsx                  # App entry point, providers
└── index.css                  # Tailwind + design-system component classes
```

### Backend

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
└── BACKEND_STATUS.md        # Backend progress & API docs
```

### Adding or changing a route

Open `src/App.jsx` — every page in the app is registered there as a
`<Route>`. Public routes sit at the top; admin routes are wrapped in
`<ProtectedRoute>`.

```jsx
<Route path="/your-new-page" element={<YourNewPage />} />
```

### Adding a new field to products

1. Add the field to the form state in `src/pages/admin/ProductForm.jsx`.
2. Add an input for it in the same file's JSX.
3. Display it wherever needed — `ProductCard.jsx` (catalog grid) or
   `ProductDetail.jsx` (single product page).
4. Make sure your backend accepts and returns the new field on the
   `/products` endpoints.

### Design tokens

Colors, fonts, and the signature "stamp" / "crate tag" component styles are
defined in `tailwind.config.js` (color palette + fonts) and `src/index.css`
(reusable classes like `.btn-primary`, `.crate-tag`, `.stamp-in` /
`.stamp-out`). Change the palette once there and it updates everywhere.

## 8. Deploying to Vercel (frontend)

This project is ready to deploy as-is:

1. Push this folder to a GitHub repository.
2. In Vercel, click **Add New → Project** and import the repo.
3. Framework preset: **Vite** (auto-detected).
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add an environment variable in Vercel's project settings:
   - `VITE_API_BASE_URL` = your backend's URL
5. Deploy. The included `vercel.json` handles client-side routing so
   refreshing on a route like `/products` or `/admin` doesn't 404.

Or deploy from the CLI:

```bash
npm install -g vercel
vercel        # first deploy, follow the prompts
vercel --prod # production deploy
```

## 9. Deploying the backend to Render

1. Push this repo to GitHub.
2. Go to https://render.com and sign in with GitHub.
3. Click **New → Blueprint** and select this repo.
4. Render detects `freshmart-backend/render.yaml` and provisions the service + database.
5. Set `JWT_SECRET_KEY` in the Render dashboard (or use the auto-generated value).
6. Deploy. The backend will be available at the Render-provided URL.
7. Set `VITE_API_BASE_URL` in Vercel's project settings to the Render URL.

## 10. Notes for whoever picks this up next

- The backend uses **marshmallow schemas** for both validation and serialization/deserialization of all request and response data.
- **Bcrypt** is used for password hashing — passwords are never stored in plain text.
- **Flask-JWT-Extended** handles authentication with Bearer tokens.
- **Flask-CORS** is enabled so the frontend can communicate with the backend.
- The frontend and backend communicate through a well-defined API contract documented in `freshmart-backend/BACKEND_STATUS.md`.
- The contact form on the Contact page is UI-only in the frontend — point its `onSubmit` in `src/pages/Contact.jsx` at a `/contact` endpoint (or an email service) when you're ready.
- Sample product images are loaded from Unsplash for preview purposes only — replace with your own product photography before going live.
