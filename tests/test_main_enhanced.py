from fastapi.testclient import TestClient

from backend.main_enhanced import app

client = TestClient(app)


def test_health():
    resp = client.get("/api/v4/monitoring/latency-health")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    assert "latency" in resp.json(), "'latency' key missing in response JSON"


def test_value_bets():
    resp = client.get("/api/v4/betting/value-bets")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    assert "value_bets" in resp.json(), "'value_bets' key missing in response JSON"


def test_arbitrage():
    resp = client.get("/api/v4/betting/arbitrage")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    assert "arbitrage" in resp.json(), "'arbitrage' key missing in response JSON"


def test_user_profile():
    resp = client.post("/api/v4/user/profile", params={"user_id": "testuser"})
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    assert (
        resp.json()["user_id"] == "testuser"
    ), f"Expected user_id 'testuser', got {resp.json().get('user_id')}"


def test_profit_analytics():
    resp = client.get("/api/v4/user/profit-analytics", params={"user_id": "testuser"})
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    assert "monthly" in resp.json(), "'monthly' key missing in response JSON"
