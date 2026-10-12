"""Run the dashboard: python -m mocap_dashboard (HOST default 127.0.0.1, PORT default 4174)."""

import os

import uvicorn

from .app import create_app


def main() -> None:
    # HOST stays loopback on the host; the container sets 0.0.0.0 and publishes
    # the port on 127.0.0.1 only (see Dockerfile and Makefile).
    uvicorn.run(create_app(), host=os.environ.get("HOST", "127.0.0.1"), port=int(os.environ.get("PORT", "4174")))


if __name__ == "__main__":
    main()
