import os
import sys

import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app, db
from app.models.user import User


@pytest.fixture()
def client():
    app = create_app()
    app.config.update(TESTING=True, SQLALCHEMY_DATABASE_URI="sqlite:///:memory:")
    with app.app_context():
        db.drop_all()
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()


def test_register_with_phone_and_strong_password(client):
    response = client.post(
        "/api/auth/register",
        json={
            "full_name": "Jane Doe",
            "email": "jane@example.com",
            "phone": "+254712345678",
            "password": "StrongPass123",
        },
    )

    assert response.status_code == 201
    data = response.get_json()
    assert data["user"]["email"] == "jane@example.com"
    assert data["user"]["phone"] == "+254712345678"
    assert "access_token" in data
