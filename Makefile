PYTHON ?= python3.12

.PHONY: venv test ui dev run

venv:
	$(PYTHON) -m venv .venv
	.venv/bin/pip install -e '.[test]'

test:
	.venv/bin/pytest
	npm test
	npm run typecheck

ui:
	npm ci
	npm run build

# API on :4174 plus the Vite dev server on :5173 (which proxies /api).
dev:
	npx concurrently -k ".venv/bin/python -m mocap_dashboard" "npm run dev"

# Serve the built UI from the API on :4174.
run: ui
	.venv/bin/python -m mocap_dashboard
