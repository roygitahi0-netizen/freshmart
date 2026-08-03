import secrets
from datetime import datetime

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

from app import db
from app.models.user import User
from app.schemas.login_schema import LoginSchema
from app.schemas.user_schema import RegisterSchema, UserSchema

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/auth/register", methods=["POST"])
def register():
    json_data = request.get_json(silent=True) or {}
    errors = RegisterSchema().validate(json_data)
    if errors:
        return jsonify({"errors": errors}), 400

    normalized_phone = json_data["phone"].strip()
    existing = User.query.filter(
        (User.email == json_data["email"].strip()) | (User.phone == normalized_phone)
    ).first()
    if existing:
        return jsonify({"errors": {"email": ["Email or phone already registered."]}}), 409

    user = User(
        full_name=json_data["full_name"].strip(),
        email=json_data["email"].strip(),
        phone=normalized_phone,
        location=json_data.get("location", "Nairobi").strip(),
        is_admin=False,
    )
    user.set_password(json_data["password"])
    user.award_points(50)
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token, "user": UserSchema().dump(user)}), 201


@auth_bp.route("/auth/login", methods=["POST"])
def login():
    json_data = request.get_json(silent=True) or {}
    errors = LoginSchema().validate(json_data)
    if errors:
        return jsonify({"errors": errors}), 400

    user = User.query.filter_by(email=json_data["email"].strip()).first()
    if not user or not user.check_password(json_data["password"]):
        return jsonify({"errors": {"email": ["Invalid email or password."]}}), 401

    user.last_login_at = datetime.utcnow()
    user.award_points(5)
    db.session.commit()

    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token, "user": UserSchema().dump(user)}), 200


@auth_bp.route("/auth/forgot-password", methods=["POST"])
def forgot_password():
    json_data = request.get_json(silent=True) or {}
    email = (json_data.get("email") or "").strip()
    if not email:
        return jsonify({"errors": {"email": ["Email is required."]}}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "If that account exists, a reset link has been prepared."}), 200

    user.reset_token = secrets.token_urlsafe(24)
    db.session.commit()
    return jsonify({
        "message": "If that account exists, a reset link has been prepared.",
        "reset_token": user.reset_token,
    }), 200


@auth_bp.route("/auth/reset-password", methods=["POST"])
def reset_password():
    json_data = request.get_json(silent=True) or {}
    token = (json_data.get("token") or "").strip()
    password = (json_data.get("password") or "").strip()

    if not token or len(password) < 8:
        return jsonify({"errors": {"password": ["A valid reset token and password are required."]}}), 400

    user = User.query.filter_by(reset_token=token).first()
    if not user:
        return jsonify({"errors": {"token": ["Reset token is invalid."]}}), 404

    user.set_password(password)
    user.reset_token = None
    db.session.commit()
    return jsonify({"message": "Password updated successfully."}), 200


@auth_bp.route("/auth/logout", methods=["POST"])
@jwt_required()
def logout():
    return jsonify({"msg": "Logged out successfully"}), 200


@auth_bp.route("/auth/me", methods=["GET"])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"user": UserSchema().dump(user)}), 200