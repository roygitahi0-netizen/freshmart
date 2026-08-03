"""
Seed script for FreshMart backend.

Creates the database tables (via Flask-Migrate) and seeds:
  - 1 admin user
  - Real product catalog

Before running this script:
  1. Set up your environment: cp .env.example .env
  2. Apply migrations: flask db upgrade
  3. Then run: python seed.py
"""
from app import create_app, db
from app.models.product import Product
from app.models.user import User


from sqlalchemy import inspect


def seed():
    app = create_app()
    with app.app_context():
        inspector = inspect(db.engine)
        if not inspector.has_table("users"):
            raise RuntimeError(
                "Database tables not found. Run 'flask db upgrade' before seeding."
            )

        admin = User.query.filter_by(email="admin@freshminimart.co.ke").first()
        if not admin:
            admin = User(
                full_name="Admin Fresh",
                email="admin@freshminimart.co.ke",
                phone="+254700000001",
                location="Nairobi",
                is_admin=True,
                loyalty_points=500,
            )
            admin.set_password("Admin123")
            db.session.add(admin)
            print("Admin user created: admin@freshminimart.co.ke / Admin123")

        if Product.query.count() == 0:
            products = [
                Product(
                    name="Vine-Ripened Tomatoes",
                    category="Produce",
                    price=2.49,
                    unit="kg",
                    in_stock=True,
                    description="Locally sourced, picked fresh this morning from Nairobi's Kagumo farm.",
                ),
                Product(
                    name="Free-Range Eggs (12pk)",
                    category="Dairy & Eggs",
                    price=3.99,
                    unit="dozen",
                    in_stock=True,
                    description="Farm-fresh eggs from free-range hens in Kiambu County. No additives.",
                ),
                Product(
                    name="Sourdough Loaf",
                    category="Bakery",
                    price=4.50,
                    unit="loaf",
                    in_stock=False,
                    description="Baked daily in-house with a crisp crust and soft crumb. Made with organic flour.",
                ),
                Product(
                    name="Organic Avocados",
                    category="Produce",
                    price=1.75,
                    unit="each",
                    in_stock=True,
                    description="Creamy, ripe avocados from Meru County. Perfect for toast or guacamole.",
                ),
                Product(
                    name="Whole Milk (1L)",
                    category="Dairy & Eggs",
                    price=1.60,
                    unit="bottle",
                    in_stock=True,
                    description="Pasteurized whole milk from a local dairy co-op in Limuru.",
                ),
                Product(
                    name="Fresh Spinach",
                    category="Produce",
                    price=1.20,
                    unit="bunch",
                    in_stock=True,
                    description="Tender spinach packed for daily delivery from Naivasha farms.",
                ),
                Product(
                    name="Brown Bread",
                    category="Bakery",
                    price=2.80,
                    unit="loaf",
                    in_stock=True,
                    description="Soft brown bread baked fresh every morning with whole wheat flour.",
                ),
                Product(
                    name="Coconut Water",
                    category="Beverages",
                    price=2.10,
                    unit="bottle",
                    in_stock=True,
                    description="Chilled coconut water from coastal Kenya. A healthy, refreshing treat.",
                ),
                Product(
                    name="Basmati Rice (5kg)",
                    category="Pantry",
                    price=8.99,
                    unit="bag",
                    in_stock=True,
                    description="Aromatic, long-grain basmati rice — a kitchen staple.",
                ),
                Product(
                    name="Cold-Pressed Orange Juice",
                    category="Beverages",
                    price=3.25,
                    unit="1L",
                    in_stock=True,
                    description="No added sugar, just fresh-squeezed oranges from Murang'a.",
                ),
                Product(
                    name="Cheddar Cheese Block",
                    category="Dairy & Eggs",
                    price=5.40,
                    unit="400g",
                    in_stock=True,
                    description="Sharp, aged cheddar — perfect for sandwiches or snacking.",
                ),
                Product(
                    name="Red Onions (1kg)",
                    category="Produce",
                    price=1.10,
                    unit="kg",
                    in_stock=True,
                    description="Fresh red onions from Nyandarua County.",
                ),
            ]
            db.session.add_all(products)
            print(f"Sample products seeded: {len(products)} items.")

        db.session.commit()
        print("Database seeded successfully!")


if __name__ == "__main__":
    seed()