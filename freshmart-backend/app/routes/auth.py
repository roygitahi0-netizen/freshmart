from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from app import db, bcrypt
from app.models.user import User
from app.schemas.user_schema import UserSchema
from app.schemas.login_schema import LoginSchema

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/auth/login", methods=["POST"])
def login():
    json_data = request.get_json() or {}
    errors = LoginSchema().validate(json_data)
    if errors:
        return jsonify({"errors": errors}), 400

    user = User.query.filter_by(email=json_data["email"]).first()
    if not user or not user.check_password(json_data["password"]):
        return jsonify({"errors": {"email": ["Invalid email or password."]}}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token, "user": UserSchema().dump(user)}), 200


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