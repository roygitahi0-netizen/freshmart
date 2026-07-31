from marshmallow import Schema, fields, validate
from app.models.product import Product


class ProductSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=255))
    category = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    price = fields.Float(required=True, validate=validate.Range(min=0))
    unit = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    image_url = fields.Str(allow_none=True)
    in_stock = fields.Bool(load_default=True)
    description = fields.Str(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    class Meta:
        model = Product
        load_instance = True