import os
from app import create_app, db
from app.models.user import User
from app.models.product import Product


def seed():
    app = create_app()
    with app.app_context():
        db.create_all()

        admin = User.query.filter_by(
            email="admin@freshminimart.co.ke"
        ).first()
        if not admin:
            admin = User(
                email="admin@freshminimart.co.ke", is_admin=True
            )
            admin.set_password("admin123")
            db.session.add(admin)
            print("Admin user created: admin@freshminimart.co.ke / admin123")

        demo_user = User.query.filter_by(
            email="user@freshminimart.co.ke"
        ).first()
        if not demo_user:
            demo_user = User(
                email="user@freshminimart.co.ke", is_admin=False
            )
            demo_user.set_password("user123")
            db.session.add(demo_user)
            print("Demo user created: user@freshminimart.co.ke / user123")

        if Product.query.count() == 0:
            products = [
                Product(
                    name="Vine-Ripened Tomatoes",
                    category="Produce",
                    price=2.49,
                    unit="kg",
                    in_stock=True,
                    description="Locally sourced, picked fresh this morning.",
                ),
                Product(
                    name="Free-Range Eggs (12pk)",
                    category="Dairy & Eggs",
                    price=3.99,
                    unit="dozen",
                    in_stock=True,
                    description="Farm-fresh eggs from free-range hens, no additives.",
                ),
                Product(
                    name="Sourdough Loaf",
                    category="Bakery",
                    price=4.50,
                    unit="loaf",
                    in_stock=False,
                    description="Baked daily in-house with a crisp crust and soft crumb.",
                ),
                Product(
                    name="Organic Avocados",
                    category="Produce",
                    price=1.75,
                    unit="each",
                    in_stock=True,
                    description="Creamy, ripe, and ready to eat.",
                ),
                Product(
                    name="Whole Milk (1L)",
                    category="Dairy & Eggs",
                    price=1.60,
                    unit="bottle",
                    in_stock=True,
                    description="Pasteurized whole milk from a local dairy co-op.",
                ),
            ]
            db.session.add_all(products)
            print("Sample products seeded.")

        db.session.commit()
        print("Database seeded successfully!")


if __name__ == "__main__":
    seed()