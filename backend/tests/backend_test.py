"""Backend tests for WinsAble V2 API - recovery/submit + status + root."""
import io
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://web-craft-867.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture
def client():
    s = requests.Session()
    return s


# ---------- Root ----------
def test_root_returns_expected_message(client):
    r = client.get(f"{API}/", timeout=30)
    assert r.status_code == 200
    data = r.json()
    assert data.get("message") == "WinsAble V2 API"


# ---------- Status ----------
def test_status_create_and_list(client):
    payload = {"client_name": "TEST_backend_test_client"}
    r = client.post(f"{API}/status", json=payload, timeout=30)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["client_name"] == payload["client_name"]
    assert "id" in data and "timestamp" in data

    r2 = client.get(f"{API}/status", timeout=30)
    assert r2.status_code == 200
    lst = r2.json()
    assert isinstance(lst, list)
    assert any(x.get("client_name") == payload["client_name"] for x in lst)


# ---------- Recovery submit ----------
BASE_FIELDS = {
    "full_name": "TEST Automated Runner",
    "email": "test-runner@example.com",
    "platform": "Instagram",
    "username": "test_runner_handle",
    "followers": "12K",
    "problem_type": "Account Takeover / Hacked",
    "since_when": "3 days ago",
    "already_submitted_appeal": "No",
    "can_login": "No",
    "additional_details": "Automated backend test - please ignore.",
}


def test_recovery_submit_success(client):
    files = [
        ("screenshots", ("test.png", io.BytesIO(b"\x89PNG\r\n\x1a\nfakepngdata"), "image/png")),
    ]
    r = client.post(f"{API}/recovery/submit", data=BASE_FIELDS, files=files, timeout=90)
    assert r.status_code == 200, f"Body: {r.text}"
    data = r.json()
    assert data.get("status") == "success"
    assert data.get("case_id")
    assert "email_id" in data
    # email_id is expected to be present since RESEND_API_KEY is set
    assert data.get("email_id"), "email_id should be returned by Resend"


def test_recovery_submit_missing_required_field(client):
    incomplete = {k: v for k, v in BASE_FIELDS.items() if k != "email"}
    r = client.post(f"{API}/recovery/submit", data=incomplete, timeout=30)
    # FastAPI Form(...) missing field => 422
    assert r.status_code == 422, r.text


def test_recovery_submit_invalid_email(client):
    bad = dict(BASE_FIELDS)
    bad["email"] = "notanemail"
    r = client.post(f"{API}/recovery/submit", data=bad, timeout=30)
    assert r.status_code == 422, r.text


def test_recovery_submit_empty_string_field(client):
    bad = dict(BASE_FIELDS)
    bad["full_name"] = "   "
    r = client.post(f"{API}/recovery/submit", data=bad, timeout=30)
    assert r.status_code == 422, r.text
    assert "full_name" in r.text.lower() or "missing" in r.text.lower()


# ---------- Logo asset ----------
def test_logo_asset_loads():
    # served from frontend public
    r = requests.get(f"{BASE_URL}/winsable-logo.png", timeout=30)
    assert r.status_code == 200
    assert r.headers.get("content-type", "").startswith("image/")
    assert len(r.content) > 1000
