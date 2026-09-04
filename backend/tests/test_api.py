import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.main import app
from app.database import Base, get_db

# Use in-memory SQLite database for fast, isolated test suite
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

# ----------------- AUTH TESTS -----------------

def test_register_success():
    response = client.post(
        "/api/auth/register",
        json={
            "full_name": "Test User",
            "email": "test@mindmate.local",
            "password": "Password123",
            "confirm_password": "Password123",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert "token" in data
    assert data["user"]["email"] == "test@mindmate.local"

def test_register_duplicate_email():
    response = client.post(
        "/api/auth/register",
        json={
            "full_name": "Test User Duplicate",
            "email": "test@mindmate.local",
            "password": "Password123",
            "confirm_password": "Password123",
        },
    )
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]

def test_login_invalid():
    response = client.post(
        "/api/auth/login",
        json={"email": "test@mindmate.local", "password": "WrongPassword"},
    )
    assert response.status_code == 401

def test_protected_route_without_token():
    response = client.get("/api/auth/me")
    assert response.status_code == 401

# ----------------- MOOD TESTS -----------------

def test_mood_flow():
    # Login
    login_res = client.post(
        "/api/auth/login",
        json={"email": "test@mindmate.local", "password": "Password123"},
    )
    token = login_res.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create mood
    create_res = client.post(
        "/api/moods",
        headers=headers,
        json={"mood": "calm", "intensity": 7, "note": "Feeling centered today."},
    )
    assert create_res.status_code == 201
    entry_id = create_res.json()["mood"]["id"]

    # Get moods
    get_res = client.get("/api/moods", headers=headers)
    assert get_res.status_code == 200
    assert len(get_res.json()["moods"]) >= 1

    # Delete mood
    del_res = client.delete(f"/api/moods/{entry_id}", headers=headers)
    assert del_res.status_code == 200

# ----------------- CHAT & ISOLATION TESTS -----------------

def test_chat_and_user_isolation():
    # User 1
    u1_login = client.post(
        "/api/auth/login",
        json={"email": "test@mindmate.local", "password": "Password123"},
    )
    u1_headers = {"Authorization": f"Bearer {u1_login.json()['token']}"}

    # User 2 Register
    u2_res = client.post(
        "/api/auth/register",
        json={
            "full_name": "Second User",
            "email": "user2@mindmate.local",
            "password": "Password123",
            "confirm_password": "Password123",
        },
    )
    u2_headers = {"Authorization": f"Bearer {u2_res.json()['token']}"}

    # User 1 creates session
    sess_res = client.post(
        "/api/chat/sessions",
        headers=u1_headers,
        json={"title": "Private Talk"},
    )
    sess_id = sess_res.json()["session"]["id"]

    # User 2 cannot access User 1's session
    forbidden_res = client.get(f"/api/chat/sessions/{sess_id}", headers=u2_headers)
    assert forbidden_res.status_code == 404

    # User 1 sends message
    msg_res = client.post(
        f"/api/chat/sessions/{sess_id}/messages",
        headers=u1_headers,
        json={"content": "I felt lonely earlier."},
    )
    assert msg_res.status_code == 200
    assert "userMessage" in msg_res.json()
    assert "assistantMessage" in msg_res.json()

    # User 1 deletes session
    del_res = client.delete(f"/api/chat/sessions/{sess_id}", headers=u1_headers)
    assert del_res.status_code == 200
