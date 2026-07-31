import os
import time
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.product import Product
from app.models.user import User
from app.schemas.product_schema import ProductSchema

products_bp = Blueprint("products", __name__)


def _save_upload(file):
    upload_folder = os.path.join(
        current_app.root_path, "static", "uploads"
    )
    os.makedirs(upload_folder, exist_ok=True)
    filename = f"{int(time.time())}_{file.filename}"
    filepath = os.path.join(upload_folder, filename)
    file.save(filepath)
    return f"/static/uploads/{filename}"


def _admin_required():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return None, (jsonify({"error": "Admin access required"}), 403)
    return user, None


@products_bp.route("/products", methods=["GET"])
def list_products():
    products = Product.query.all()
    return jsonify({"products": ProductSchema(many=True).dump(products)}), 200


@products_bp.route("/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify({"product": ProductSchema().dump(product)}), 200


@products_bp.route("/products", methods=["POST"])
@jwt_required()
def create_product():
    user, err = _admin_required()
    if err:
        return err

    form = request.form
    file = request.files.get("image")

    data = {
        "name": form.get("name"),
        "category": form.get("category"),
        "price": float(form.get("price", 0)),
        "unit": form.get("unit"),
        "in_stock": form.get("in_stock") == "true",
        "description": form.get("description", ""),
    }

    errors = ProductSchema().validate(data)
    if errors:
        return jsonify({"errors": errors}), 400

    image_url = _save_upload(file) if file and file.filename else None
    if image_url:
        data["image_url"] = image_url

    product = Product(**data)
    db.session.add(product)
    db.session.commit()

    return jsonify({"product": ProductSchema().dump(product)}), 201


@products_bp.route("/products/<int:product_id>/update", methods=["POST"])
@jwt_required()
def update_product(product_id):
    user, err = _admin_required()
    if err:
        return err

    product = Product.query.get_or_404(product_id)
    form = request.form
    file = request.files.get("image")

    data = {
        "name": form.get("name", product.name),
        "category": form.get("category", product.category),
        "price": float(form.get("price", product.price)),
        "unit": form.get("unit", product.unit),
        "in_stock": form.get("in_stock", str(product.in_stock).lower())
        == "true",
        "description": form.get("description", product.description),
    }

    errors = ProductSchema().validate(data)
    if errors:
        return jsonify({"errors": errors}), 400

    if file and file.filename:
        data["image_url"] = _save_upload(file)

    for key, value in data.items():
        setattr(product, key, value)

    db.session.commit()
    return jsonify({"product": ProductSchema().dump(product)}), 200


@products_bp.route("/products/<int:product_id>", methods=["DELETE"])
@jwt_required()
def delete_product(product_id):
    user, err = _admin_required()
    if err:
        return err

    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"msg": "Product deleted"}), 200