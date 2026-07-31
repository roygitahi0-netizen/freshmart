import { apiRequest, apiUpload, API_BASE_URL } from "./client";
import { sampleProducts } from "../data/sampleProducts";

// Matches the companion Flask + SQLAlchemy backend (see
// freshmart-backend/app/products/routes.py):
//   GET    /api/products             -> { products: [...] }
//   GET    /api/products/:id         -> { product: {...} }
//   POST   /api/products             -> { product: {...} }   (multipart/form-data)
//   PUT    /api/products/:id         -> { product: {...} }   (multipart/form-data)
//   DELETE /api/products/:id         -> { msg }
//
// SQLAlchemy models serialize as snake_case (in_stock, image_url,
// created_at). The mappers below translate that to the camelCase shape
// the rest of the React app uses, so components never deal with snake_case.
//
// NOTE: Until VITE_API_BASE_URL is configured, these functions fall back to
// local sample data so the UI can be built, previewed, and demoed on its
// own. The fallback is skipped automatically once a backend is connected.

function fromApi(p) {
  if (!p) return null;
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: Number(p.price),
    unit: p.unit,
    // SQLAlchemy models store a relative path/filename; the backend serves
    // uploads from /static/uploads, so build the full URL here.
    image: p.image_url?.startsWith("http")
      ? p.image_url
      : `${API_BASE_URL}${p.image_url || ""}`,
    inStock: Boolean(p.in_stock),
    description: p.description || "",
  };
}

function toFormData(fields, imageFile) {
  const formData = new FormData();
  formData.append("name", fields.name);
  formData.append("category", fields.category);
  formData.append("price", fields.price);
  formData.append("unit", fields.unit);
  formData.append("description", fields.description || "");
  // Flask/SQLAlchemy convention: boolean sent as "true"/"false" string,
  // parsed server-side with request.form.get("in_stock") == "true"
  formData.append("in_stock", fields.inStock ? "true" : "false");
  if (imageFile) formData.append("image", imageFile);
  return formData;
}

export async function getProducts() {
  if (!API_BASE_URL) return sampleProducts;
  const data = await apiRequest("/products");
  return (data.products || []).map(fromApi);
}

export async function getProduct(id) {
  if (!API_BASE_URL) return sampleProducts.find((p) => String(p.id) === String(id)) || null;
  const data = await apiRequest(`/products/${id}`);
  return fromApi(data.product);
}

export async function createProduct({ fields, imageFile }, token) {
  if (!API_BASE_URL) {
    throw new Error("No backend connected yet. Set VITE_API_BASE_URL in .env to save products.");
  }
  const formData = toFormData(fields, imageFile);
  const data = await apiUpload("/products", { formData, token });
  return fromApi(data.product);
}

export async function updateProduct(id, { fields, imageFile }, token) {
  if (!API_BASE_URL) {
    throw new Error("No backend connected yet. Set VITE_API_BASE_URL in .env to save products.");
  }
  const formData = toFormData(fields, imageFile);
  // Flask's request.files parsing typically expects POST for multipart
  // bodies (some WSGI/browser combinations mangle PUT + multipart), so the
  // backend exposes update at POST /api/products/:id/update. Adjust here
  // if your Flask routes use PUT with multipart directly.
  const data = await apiUpload(`/products/${id}/update`, { formData, token });
  return fromApi(data.product);
}

export async function deleteProduct(id, token) {
  if (!API_BASE_URL) {
    throw new Error("No backend connected yet. Set VITE_API_BASE_URL in .env to delete products.");
  }
  return apiRequest(`/products/${id}`, { method: "DELETE", token });
}
