from marshmallow import Schema, fields, validate
from app.models.user import User


class RegisterSchema(Schema):
    full_name = fields.Str(required=True, validate=validate.Length(min=2, max=255))
    email = fields.Email(required=True)
    phone = fields.Str(required=True, validate=validate.Regexp(r"^\+?[1-9]\d{7,14}$"))
    password = fields.Str(required=True, validate=validate.Regexp(r"^(?=.*[A-Za-z])(?=.*\d).{8,}$"))
    location = fields.Str(load_default="Nairobi")


class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    full_name = fields.Str(allow_none=True)
    email = fields.Email(required=True)
    phone = fields.Str(allow_none=True)
    is_admin = fields.Bool(dump_only=True)
    loyalty_points = fields.Int(dump_only=True)
    location = fields.Str(allow_none=True)
    created_at = fields.DateTime(dump_only=True)

    class Meta:
        model = User
        load_instance = True