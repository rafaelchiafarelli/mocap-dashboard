from pathlib import Path

from fastapi.testclient import TestClient

from mocap_dashboard.app import create_app

LOCAL = {"host": "127.0.0.1:4174", "origin": "http://127.0.0.1:4174"}


def client() -> TestClient:
    return TestClient(create_app(session_token="test-session-token", serve_frontend=False))


def test_inventories_film_only_with_session_token(tmp_path: Path) -> None:
    (tmp_path / "creative-brief.md").write_text("# Brief\n")

    response = client().post(
        "/api/film/inspect",
        headers={**LOCAL, "x-workflow-token": "test-session-token"},
        json={"path": str(tmp_path)},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["title"] == tmp_path.name
    assert [(d["path"], d["category"]) for d in body["documents"]] == [("creative-brief.md", "Brief/direction")]


def test_rejects_missing_token(tmp_path: Path) -> None:
    response = client().post("/api/film/inspect", headers=LOCAL, json={"path": str(tmp_path)})
    assert response.status_code == 403


def test_rejects_non_local_origin() -> None:
    response = client().get("/api/session", headers={**LOCAL, "origin": "https://untrusted.example"})
    assert response.status_code == 403


def test_rejects_non_local_host() -> None:
    response = client().get("/api/session", headers={"host": "evil.example:4174"})
    assert response.status_code == 403


def test_rejects_blank_path() -> None:
    response = client().post(
        "/api/film/inspect",
        headers={**LOCAL, "x-workflow-token": "test-session-token"},
        json={"path": "   "},
    )
    assert response.status_code == 400
