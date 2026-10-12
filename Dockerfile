# Dashboard image: React UI built with Node, served by the Python backend.
# Base images pinned by digest; Python deps only from the hashed lockfile.

# ---- UI build (Node is needed only here) ----
FROM node:22-bookworm-slim@sha256:c3de60bf2f9dd0ac6370e6117950ff62d6e339527e7472301c9c78a017978392 AS ui
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY public ./public
COPY src ./src
RUN npm run build

# ---- Claude Code CLI, pinned to the version used on the host ----
FROM node:22-bookworm-slim@sha256:c3de60bf2f9dd0ac6370e6117950ff62d6e339527e7472301c9c78a017978392 AS claude
ARG CLAUDE_CODE_VERSION=2.1.235
RUN npm install --global --prefix /opt/claude --no-audit --no-fund "@anthropic-ai/claude-code@${CLAUDE_CODE_VERSION}"

# ---- runtime (shared Mocap Studio base: Ubuntu 24.04, system Python 3.12) ----
FROM ubuntu:24.04@sha256:534baea6a22c03a63003dbc8dbe78fe34bc0d7e595d9a9dc9834884ff530eb55
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 python3-venv \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /build-py
COPY requirements.lock ./
RUN python3 -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir --require-hashes -r requirements.lock
COPY pyproject.toml README.md ./
COPY mocap_dashboard ./mocap_dashboard
RUN /opt/venv/bin/pip install --no-cache-dir --no-deps .
COPY --from=ui /build/dist /opt/ui
# The claude entry point is a native linux-x64 binary: no Node at runtime.
COPY --from=claude /opt/claude /opt/claude
ENV PATH=/opt/claude/bin:$PATH

ENV HOST=0.0.0.0 PORT=4174 MOCAP_DASHBOARD_DIST=/opt/ui
EXPOSE 4174
USER ubuntu
WORKDIR /
CMD ["/opt/venv/bin/python", "-m", "mocap_dashboard"]
