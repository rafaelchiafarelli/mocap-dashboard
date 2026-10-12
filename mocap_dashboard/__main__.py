"""Run the dashboard on loopback: python -m mocap_dashboard (PORT, default 4174)."""

import os

import uvicorn

from .app import create_app


def main() -> None:
    uvicorn.run(create_app(), host="127.0.0.1", port=int(os.environ.get("PORT", "4174")))


if __name__ == "__main__":
    main()
