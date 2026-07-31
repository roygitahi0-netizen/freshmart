from marshmallow import Schema, fields
from app.models.user import User


class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    email = fields.Email(required=True)
    is_admin = fields.Bool(dump_only=True)
    created_at = fields.DateTime(dump_only=True)

    class Meta:
        model = User
        load_instance = True