"""Loopback-only API that serves the React UI and inspects project folders."""

import hmac
import secrets
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field, ValidationError

from .inventory import ProjectScanError, scan_project

BODY_LIMIT = 16 * 1024
DIST = Path(__file__).resolve().parent.parent / "dist"

_LOCAL_HOSTS = ("localhost", "127.0.0.1", "[::1]")
_LOCAL_PORTS = (4174, 5173)  # API and Vite dev server
ALLOWED_HOSTS = frozenset(f"{host}:{port}" for host in _LOCAL_HOSTS for port in _LOCAL_PORTS)
ALLOWED_ORIGINS = frozenset(f"http://{host}" for host in ALLOWED_HOSTS)


class ProjectRequest(BaseModel):
    path: str = Field(min_length=1, max_length=4096)


def _error(status: int, message: str) -> JSONResponse:
    return JSONResponse({"error": message}, status_code=status)


def _trusted(request: Request) -> bool:
    if request.headers.get("host", "").lower() not in ALLOWED_HOSTS:
        return False
    origin = request.headers.get("origin")
    return origin is None or origin in ALLOWED_ORIGINS


def create_app(session_token: str | None = None, serve_frontend: bool = True) -> FastAPI:
    token = session_token or secrets.token_hex(32)
    app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)

    @app.middleware("http")
    async def local_only(request: Request, call_next):
        if request.url.path.startswith("/api/") and not _trusted(request):
            return _error(403, "Requests must come from the local dashboard origin.")
        return await call_next(request)

    @app.get("/api/session")
    async def session() -> JSONResponse:
        return JSONResponse({"token": token}, headers={"cache-control": "no-store"})

    @app.post("/api/project/inspect")
    async def inspect(request: Request) -> JSONResponse:
        supplied = request.headers.get("x-workflow-token", "")
        if not hmac.compare_digest(supplied.encode(), token.encode()):
            return _error(403, "Dashboard session token is missing or invalid.")
        body = await request.body()
        if len(body) > BODY_LIMIT:
            return _error(413, "Request body is too large.")
        try:
            data = ProjectRequest.model_validate_json(body)
            path = data.path.strip()
            if not path:
                raise ValueError
        except (ValidationError, ValueError):
            return _error(400, "Provide a project folder path (up to 4096 characters).")
        try:
            return JSONResponse(scan_project(path).to_json())
        except ProjectScanError as error:
            return _error(400, str(error))

    @app.api_route("/api/{rest:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
    async def api_not_found(rest: str) -> JSONResponse:
        return _error(404, "API route not found.")

    if serve_frontend and (DIST / "index.html").is_file():

        @app.get("/{rest:path}")
        async def frontend(rest: str) -> FileResponse:
            candidate = (DIST / rest).resolve()
            if rest and candidate.is_file() and DIST in candidate.parents:
                return FileResponse(candidate)
            return FileResponse(DIST / "index.html")

    return app
