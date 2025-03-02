import pytest
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_create_user():
    response = client.post("/users", json={"email": "balogunridwan@gmail.com", "firstname": "Ridwan", "lastname": "Balogun"})
    assert response.status_code == 201
    assert "user_id" in response.json()