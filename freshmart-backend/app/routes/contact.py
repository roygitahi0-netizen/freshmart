from flask import Blueprint, request, jsonify
from app import db
from app.models.contact_message import ContactMessage
from app.schemas.contact_schema import ContactSchema

contact_bp = Blueprint("contact", __name__)


@contact_bp.route("/contact", methods=["POST"])
def submit_contact():
    json_data = request.get_json() or {}
    errors = ContactSchema().validate(json_data)
    if errors:
        return jsonify({"errors": errors}), 400

    message = ContactMessage(
        name=json_data["name"],
        email=json_data["email"],
        message=json_data["message"],
    )
    db.session.add(message)
    db.session.commit()

    return jsonify({"msg": "Message received"}), 201