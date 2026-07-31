import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, ImagePlus, AlertCircle } from "lucide-react";
import { getProduct, createProduct, updateProduct } from "../../api/products";
import { categories } from "../../data/sampleProducts";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";
import FieldError from "../../components/FieldError";

const emptyForm = {
  name: "",
  category: categories[1] || "Produce",
  price: "",
  unit: "",
  description: "",
  inStock: true,
};

export default function ProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { token } = useAuth();

  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState(null);

  useEffect(() => {
    if (!isEditing) return;
    getProduct(id).then((p) => {
      if (p) {
        setForm({
          name: p.name,
          category: p.category,
          price: p.price,
          unit: p.unit,
          description: p.description,
          inStock: p.inStock,
        });
        setImagePreview(p.image);
      }
      setLoading(false);
    });
  }, [id, isEditing]);

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setFieldErrors(null);

    try {
      if (isEditing) {
        await updateProduct(id, { fields: form, imageFile }, token);
      } else {
        await createProduct({ fields: form, imageFile }, token);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.message);
      // Marshmallow validation errors are keyed by the raw form field name
      // sent to Flask (e.g. "in_stock", not "inStock") — see products.js toFormData().
      setFieldErrors(err.fieldErrors || null);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loader label="Loading product…" />;

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-14">
      <Link to="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-market-green font-medium mb-6">
        <ArrowLeft size={15} /> Back to products
      </Link>

      <h1 className="text-3xl font-semibold text-ink mb-8">
        {isEditing ? "Edit product" : "Add a new product"}
      </h1>

      <form onSubmit={handleSubmit} className="crate-tag p-6 space-y-5">
        {error && (
          <div className="flex items-start gap-2 text-sm text-tomato bg-tomato/5 border border-tomato/20 rounded-md px-3 py-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="label-field">Product photo</label>
          <label className="flex items-center gap-4 border border-dashed border-market-green/30 rounded-md p-4 cursor-pointer hover:border-market-green/60 transition-colors">
            {imagePreview ? (
              <img src={imagePreview} alt="" className="w-16 h-16 rounded-md object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-md bg-paper-dark flex items-center justify-center text-market-green/40">
                <ImagePlus size={22} />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-market-green">Upload a photo</p>
              <p className="text-xs text-ink/40">PNG or JPG, up to 5MB</p>
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label-field">Product name</label>
            <input
              required
              className={`input ${fieldErrors?.name ? "!border-tomato" : ""}`}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Vine-Ripened Tomatoes"
            />
            <FieldError errors={fieldErrors} field="name" />
          </div>
          <div>
            <label className="label-field">Category</label>
            <select
              className={`input ${fieldErrors?.category ? "!border-tomato" : ""}`}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {categories.filter((c) => c !== "All").map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <FieldError errors={fieldErrors} field="category" />
          </div>
          <div>
            <label className="label-field">Price</label>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              className={`input ${fieldErrors?.price ? "!border-tomato" : ""}`}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="0.00"
            />
            <FieldError errors={fieldErrors} field="price" />
          </div>
          <div>
            <label className="label-field">Unit</label>
            <input
              required
              className={`input ${fieldErrors?.unit ? "!border-tomato" : ""}`}
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              placeholder="e.g. kg, dozen, each"
            />
            <FieldError errors={fieldErrors} field="unit" />
          </div>
        </div>

        <div>
          <label className="label-field">Description</label>
          <textarea
            className={`input min-h-[100px] resize-none ${fieldErrors?.description ? "!border-tomato" : ""}`}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Short description shown on the product page"
          />
          <FieldError errors={fieldErrors} field="description" />
        </div>

        <div>
          <div className="flex items-center justify-between rounded-md border border-market-green/15 px-4 py-3.5">
            <div>
              <p className="text-sm font-medium text-ink">Stock status</p>
              <p className="text-xs text-ink/50">Toggle whether this item shows as available.</p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, inStock: !form.inStock })}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                form.inStock ? "bg-basil" : "bg-tomato/60"
              }`}
              aria-pressed={form.inStock}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  form.inStock ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <FieldError errors={fieldErrors} field="in_stock" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? "Saving…" : isEditing ? "Save changes" : "Add product"}
          </button>
          <Link to="/admin/products" className="btn-outline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
