PYTHON ?= python3.12

.PHONY: venv test ui dev run lock image up

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

# Python lockfile with hashes (DEPENDENCIES.md rule B). Rerun after editing pyproject.toml.
lock:
	.venv/bin/pip install -q uv
	.venv/bin/uv pip compile pyproject.toml --python-version 3.12 --generate-hashes -o requirements.lock

IMAGE ?= mocap-dashboard:dev
# Film project folders are mounted at the same path, so the path typed in the
# UI is the same inside and outside the container.
PROJECTS ?= /mnt/g

image:
	docker build -t $(IMAGE) .

# The supported way to run the dashboard: published on loopback only.
up: image
	docker run --rm -it --user $$(id -u):$$(id -g) \
		-p 127.0.0.1:4174:4174 \
		-v $(PROJECTS):$(PROJECTS) \
		$(IMAGE)
