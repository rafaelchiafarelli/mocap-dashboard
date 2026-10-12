from pathlib import Path

import pytest

from mocap_dashboard.inventory import ProjectScanError, scan_project


def test_lists_markdown_with_relative_paths_and_categories(tmp_path: Path) -> None:
    (tmp_path / "planning").mkdir()
    (tmp_path / "planning" / "production-worklist.md").write_text("# Worklist\n")
    (tmp_path / "script.md").write_text("# Script\n")

    inventory = scan_project(str(tmp_path))

    assert inventory.title == tmp_path.name
    assert [(d.path, d.category) for d in inventory.documents] == [
        ("planning/production-worklist.md", "Worklist"),
        ("script.md", "Script/source"),
    ]
    assert inventory.warnings == []


def test_does_not_follow_directory_symlinks_outside_project(tmp_path: Path) -> None:
    root, outside = tmp_path / "root", tmp_path / "outside"
    root.mkdir()
    outside.mkdir()
    (outside / "private.md").write_text("# Not in the selected project\n")
    (root / "external").symlink_to(outside)

    assert scan_project(str(root)).documents == []


def test_rejects_a_file_as_project_root(tmp_path: Path) -> None:
    brief = tmp_path / "brief.md"
    brief.write_text("# Brief\n")

    with pytest.raises(ProjectScanError, match="Select a folder, not a file."):
        scan_project(str(brief))


def test_skips_ignored_directories_and_warns_past_depth_limit(tmp_path: Path) -> None:
    (tmp_path / "node_modules").mkdir()
    (tmp_path / "node_modules" / "readme.md").write_text("x")
    deep = tmp_path.joinpath(*[f"d{i}" for i in range(7)])
    deep.mkdir(parents=True)
    (deep / "deep.md").write_text("x")

    inventory = scan_project(str(tmp_path))

    assert inventory.documents == []
    assert any("level scan limit" in warning for warning in inventory.warnings)
