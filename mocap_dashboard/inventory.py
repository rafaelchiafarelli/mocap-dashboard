"""Read-only Markdown inventory of a selected film project folder."""

import os
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path

MAX_DEPTH = 5
MAX_MARKDOWN_FILES = 500
IGNORED_DIRECTORIES = frozenset({".git", "node_modules", "dist", "build", ".venv", "venv", "__pycache__"})


class ProjectScanError(Exception):
    """The selected folder can't be inventoried; the message is shown to the user."""


@dataclass
class MarkdownDocument:
    path: str
    category: str
    sizeBytes: int
    modifiedAt: str


@dataclass
class ProjectInventory:
    title: str
    documents: list[MarkdownDocument] = field(default_factory=list)
    scannedAt: str = ""
    warnings: list[str] = field(default_factory=list)

    def to_json(self) -> dict:
        return asdict(self)


def _iso(timestamp: float) -> str:
    """Same shape as JavaScript's Date.toISOString(), which the UI expects."""
    moment = datetime.fromtimestamp(timestamp, tz=timezone.utc)
    return moment.strftime("%Y-%m-%dT%H:%M:%S.") + f"{moment.microsecond // 1000:03d}Z"


def _inside(root: Path, candidate: Path) -> bool:
    return candidate == root or root in candidate.parents


def category_for(name: str) -> str:
    name = name.lower()
    if "script" in name or "screenplay" in name:
        return "Script/source"
    if "brief" in name or "creative-direction" in name:
        return "Brief/direction"
    if "worklist" in name or "work-package" in name:
        return "Worklist"
    if any(word in name for word in ("readiness", "assessment", "audit")):
        return "Readiness/assessment"
    if "workflow" in name or "production-plan" in name:
        return "Workflow"
    return "Other Markdown"


def scan_project(selected_path: str) -> ProjectInventory:
    try:
        root = Path(selected_path).resolve(strict=True)
    except (OSError, RuntimeError):
        raise ProjectScanError("The selected project folder does not exist or cannot be accessed.") from None
    if not root.is_dir():
        raise ProjectScanError("Select a folder, not a file.")

    inventory = ProjectInventory(title=root.name or str(root))
    state = {"limit": False, "depth": False}

    def visit(directory: Path, depth: int) -> None:
        if depth > MAX_DEPTH:
            state["depth"] = True
            return
        with os.scandir(directory) as scan:
            entries = sorted(scan, key=lambda entry: entry.name)
        for entry in entries:
            if state["limit"]:
                return
            if entry.is_symlink():
                continue
            path = Path(entry.path)
            if entry.is_dir(follow_symlinks=False):
                if entry.name not in IGNORED_DIRECTORIES:
                    visit(path, depth + 1)
                continue
            if not entry.is_file(follow_symlinks=False) or not entry.name.lower().endswith(".md"):
                continue
            if len(inventory.documents) >= MAX_MARKDOWN_FILES:
                state["limit"] = True
                inventory.warnings.append(f"Only the first {MAX_MARKDOWN_FILES} Markdown files were inventoried.")
                return
            canonical = path.resolve()
            if not _inside(root, canonical):
                continue
            stats = entry.stat(follow_symlinks=False)
            inventory.documents.append(
                MarkdownDocument(
                    path=canonical.relative_to(root).as_posix(),
                    category=category_for(entry.name),
                    sizeBytes=stats.st_size,
                    modifiedAt=_iso(stats.st_mtime),
                )
            )

    try:
        visit(root, 0)
    except OSError as error:
        raise ProjectScanError(f"Could not finish the read-only document inventory: {error.strerror or error}") from None

    if state["depth"]:
        inventory.warnings.append(f"Some Markdown files may be deeper than the {MAX_DEPTH}-level scan limit.")
    inventory.scannedAt = _iso(datetime.now(tz=timezone.utc).timestamp())
    return inventory
