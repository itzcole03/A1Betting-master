"""UltimateSportsBettingApp Workspace Audit Tool

This module provides a comprehensive audit utility for scanning the codebase for language statistics, keyword usage, TODO/FIXME/HACK comments, secrets in configs, and test files. It generates a Markdown report summarizing the findings.

Usage:
    python audit_workspace.py

All functions are type-annotated and documented for clarity and maintainability.
"""

import ast
import re
from collections import defaultdict
from pathlib import Path

# --- CONFIGURATION ---

# Folder and file ignores
IGNORE_FOLDERS = {
    ".git",
    "node_modules",
    "__pycache__",
    "dist",
    "build",
    ".venv",
    ".env",
    "coverage",
    ".idea",
    ".vscode",
}
IGNORE_FILE_EXTENSIONS = {
    ".lock",
    ".log",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".bmp",
    ".ico",
    ".woff",
    ".woff2",
    ".ttf",
    ".zip",
    ".tar.gz",
}

# Keywords to search for (lowercase)
KEYWORDS = {
    "ml_models": [
        "model",
        "predict",
        "sklearn",
        "tensorflow",
        "torch",
        "xgboost",
        "lightgbm",
        "mlflow",
        "keras",
        "shap",
        "explainer",
        "ensemble",
        "finalpredictionengine",
    ],
    "betting": [
        "bet",
        "payout",
        "stake",
        "kellycriterion",
        "wager",
        "riskprofile",
        "lineup",
        "strategy",
        "bestbetselector",
        "smartcontrolsbar",
    ],
    "websocket": ["websocket", "ws.onmessage", "ws.send", "websocketclient"],
    "admin_panel": ["admin", "dashboard", "management", "controlpanel", "useradmin"],
    "money_features": [
        "money",
        "wallet",
        "balance",
        "transaction",
        "deposit",
        "withdraw",
        "funds",
        "currency",
    ],
    "prediction_engine": [
        "finalpredictionengine",
        "ensemble",
        "model",
        "predict",
        "explainability",
        "shap",
        "featureimportance",
    ],
}

# Config secret keywords
SECRET_KEYWORDS = [
    "api_key",
    "secret",
    "token",
    "password",
    "jwt",
    "private_key",
    "client_secret",
    "access_key",
    "auth_token",
]

# File patterns for test files
TEST_PATTERNS = [r"test_", r"_test", r".spec.", r".test."]

# File extensions for different types
PYTHON_EXTENSIONS = {".py"}
TYPESCRIPT_EXTENSIONS = {".ts", ".tsx", ".js", ".jsx"}
CONFIG_EXTENSIONS = {".env", ".json", ".yaml", ".yml", ".ini", ".cfg"}

# --- UTILS ---


def is_ignored_path(path: Path):
    """Determine if a path should be ignored based on folder or file extension.

    Args:
    ----
        path (Path): The file or directory path to check.

    Returns:
    -------
        bool: True if the path should be ignored, False otherwise.

    """
    for part in path.parts:
        if part in IGNORE_FOLDERS:
            return True
    if path.suffix.lower() in IGNORE_FILE_EXTENSIONS:
        return True
    return False


def is_test_file(path: Path):
    """Check if a file is a test file based on naming patterns.

    Args:
    ----
        path (Path): The file path to check.

    Returns:
    -------
        bool: True if the file is a test file, False otherwise.

    """
    filename = path.name.lower()
    return any(re.search(pattern, filename) for pattern in TEST_PATTERNS)


def safe_read_text(path: Path):
    """Safely read text from a file, trying UTF-8 and falling back to Latin-1.

    Args:
    ----
        path (Path): The file path to read.

    Returns:
    -------
        str: The file contents as a string, or an empty string if unreadable.

    """
    try:
        return path.read_text(encoding="utf-8")
    except Exception:
        try:
            return path.read_text(encoding="latin-1")
        except Exception:
            return ""


def find_todos_in_text(text, filename):
    """Find all TODO, FIXME, and HACK comments in a text block.

    Args:
    ----
        text (str): The text to scan.
        filename (str): The filename for reporting.

    Returns:
    -------
        list[dict]: List of found comments with line, type, text, and file.

    """
    todos = []
    pattern = re.compile(r"(TODO|FIXME|HACK)[:\s]*(.*)", re.IGNORECASE)
    for i, line in enumerate(text.splitlines(), 1):
        m = pattern.search(line)
        if m:
            todos.append(
                {
                    "line": i,
                    "type": m.group(1).upper(),
                    "text": m.group(2).strip(),
                    "file": filename,
                }
            )
    return todos


def scan_config_secrets(text, filename):
    """Scan text for potential secret keys based on known keywords.

    Args:
    ----
        text (str): The text to scan.
        filename (str): The filename for reporting.

    Returns:
    -------
        list[dict]: List of found secrets with file, key, and value.

    """
    secrets_found = []
    for secret_key in SECRET_KEYWORDS:
        pattern = re.compile(
            rf'{secret_key}["\']?\s*[:=]\s*["\']?(\S+)["\']?', re.IGNORECASE
        )
        for m in pattern.finditer(text):
            secrets_found.append(
                {"file": filename, "key": secret_key, "value": m.group(1)}
            )
    return secrets_found


def extract_keywords_from_text(text, keywords):
    """Return a dict of keyword -> count for all keywords found in text (case-insensitive).

    Args:
    ----
        text (str): The text to scan.
        keywords (dict): Dictionary of categories to keyword lists.

    Returns:
    -------
        dict: Mapping of keyword to count.

    """
    found = defaultdict(int)
    lowered = text.lower()
    for key in keywords:
        for kw in keywords[key]:
            found[kw] += lowered.count(kw)
    return found


def analyze_python_file(path: Path):
    """Analyze a Python file for imports, classes, functions, docstrings, keywords, and TODOs.

    Args:
    ----
        path (Path): The Python file path.

    Returns:
    -------
        dict: Analysis results.

    """
    results = {
        "imports": [],
        "classes": [],
        "functions": [],
        "docstrings": [],
        "keywords": defaultdict(int),
        "todos": [],
    }
    source = safe_read_text(path)
    try:
        tree = ast.parse(source, filename=str(path))
    except SyntaxError:
        return results  # Skip files with syntax errors

    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                results["imports"].append(alias.name)
        elif isinstance(node, ast.ImportFrom):
            module = node.module if node.module else ""
            for alias in node.names:
                results["imports"].append(
                    f"{module}.{alias.name}" if module else alias.name
                )
        elif isinstance(node, ast.ClassDef):
            results["classes"].append(node.name)
            if ast.get_docstring(node):
                results["docstrings"].append(ast.get_docstring(node))
        elif isinstance(node, ast.FunctionDef):
            results["functions"].append(node.name)
            if ast.get_docstring(node):
                results["docstrings"].append(ast.get_docstring(node))

    for cat, kws in KEYWORDS.items():
        for kw in kws:
            count = source.lower().count(kw.lower())
            if count > 0:
                results["keywords"][kw] += count

    results["todos"] = find_todos_in_text(source, str(path))
    return results


def analyze_typescript_file(path: Path):
    """Analyze a TypeScript/JavaScript file for keywords and TODOs.

    Args:
    ----
        path (Path): The file path.

    Returns:
    -------
        dict: Analysis results.

    """
    results = {"keywords": defaultdict(int), "todos": []}
    source = safe_read_text(path)
    for cat, kws in KEYWORDS.items():
        for kw in kws:
            count = source.lower().count(kw.lower())
            if count > 0:
                results["keywords"][kw] += count
    results["todos"] = find_todos_in_text(source, str(path))
    return results


def analyze_config_file(path: Path):
    """Analyze a config file for secrets and TODOs.

    Args:
    ----
        path (Path): The config file path.

    Returns:
    -------
        dict: Analysis results.

    """
    results = {"secrets": [], "todos": []}
    source = safe_read_text(path)
    results["secrets"] = scan_config_secrets(source, str(path))
    results["todos"] = find_todos_in_text(source, str(path))
    return results


# --- MAIN SCAN ---


def main_scan(root_path: Path):
    summary = {
        "total_files": 0,
        "total_lines": 0,
        "by_language": defaultdict(lambda: {"count": 0, "lines": 0, "files": []}),
        "todos": [],
        "secrets": [],
        "keyword_counts": defaultdict(int),
        "keyword_files": defaultdict(set),
        "test_files": [],
    }

    for path in root_path.rglob("*"):
        if path.is_file() and not is_ignored_path(path):
            summary["total_files"] += 1
            try:
                lines_count = path.read_text(encoding="utf-8").count("\n") + 1
            except Exception:
                lines_count = 0
            summary["total_lines"] += lines_count

            ext = path.suffix.lower()
            if ext in PYTHON_EXTENSIONS:
                summary["by_language"]["Python"]["count"] += 1
                summary["by_language"]["Python"]["lines"] += lines_count
                summary["by_language"]["Python"]["files"].append(str(path))
                py_results = analyze_python_file(path)
                # Aggregate keywords and todos
                for kw, c in py_results["keywords"].items():
                    summary["keyword_counts"][kw] += c
                    summary["keyword_files"][kw].add(str(path))
                summary["todos"].extend(py_results["todos"])
            elif ext in TYPESCRIPT_EXTENSIONS:
                summary["by_language"]["TypeScript"]["count"] += 1
                summary["by_language"]["TypeScript"]["lines"] += lines_count
                summary["by_language"]["TypeScript"]["files"].append(str(path))
                ts_results = analyze_typescript_file(path)
                for kw, c in ts_results["keywords"].items():
                    summary["keyword_counts"][kw] += c
                    summary["keyword_files"][kw].add(str(path))
                summary["todos"].extend(ts_results["todos"])
                if is_test_file(path):
                    summary["test_files"].append(str(path))
            elif ext in CONFIG_EXTENSIONS:
                summary["by_language"]["Config"]["count"] += 1
                summary["by_language"]["Config"]["lines"] += lines_count
                summary["by_language"]["Config"]["files"].append(str(path))
                config_results = analyze_config_file(path)
                summary["secrets"].extend(config_results["secrets"])
                summary["todos"].extend(config_results["todos"])
            else:
                summary["by_language"]["Other"]["count"] += 1
                summary["by_language"]["Other"]["lines"] += lines_count
                summary["by_language"]["Other"]["files"].append(str(path))

            if is_test_file(path) and str(path) not in summary["test_files"]:
                summary["test_files"].append(str(path))

    return summary


# --- REPORT GENERATION ---


def generate_markdown_report(summary):
    md = []
    md.append("# UltimateSportsBettingApp Workspace Audit Report\n")
    md.append(f'**Total files scanned:** {summary["total_files"]}')
    md.append(f'**Total lines of code:** {summary["total_lines"]}\n')

    md.append("## Breakdown by Language\n")
    for lang, data in summary["by_language"].items():
        md.append(f'- **{lang}**: {data["count"]} files, {data["lines"]} lines')

    md.append("\n## Keyword Usage Summary\n")
    for kw, count in sorted(summary["keyword_counts"].items(), key=lambda x: -x[1]):
        files = summary["keyword_files"][kw]
        md.append(f"- `{kw}`: {count} occurrences in {len(files)} files")

    md.append("\n## TODO / FIXME / HACK Comments\n")
    if summary["todos"]:
        for todo in summary["todos"]:
            md.append(
                f'- [{todo["type"]}] {todo["file"]} (line {todo["line"]}): {todo["text"]}'
            )
    else:
        md.append("- None found.")

    md.append("\n## Potential Secret Keys Found in Configs\n")
    if summary["secrets"]:
        for secret in summary["secrets"]:
            md.append(
                f'- `{secret["key"]}` found in {secret["file"]}, value: `{secret["value"]}`'
            )
    else:
        md.append("- None found.")

    md.append("\n## Test Files Detected\n")
    if summary["test_files"]:
        for tf in summary["test_files"]:
            md.append(f"- {tf}")
    else:
        md.append("- None found.")

    return "\n".join(md)


# --- MAIN ENTRY POINT ---

if __name__ == "__main__":
    root = Path(".").resolve()  # Run in current directory
    print("Starting UltimateSportsBettingApp workspace audit...")
    summary = main_scan(root)
    report = generate_markdown_report(summary)
    report_file = root / "UltimateSportsBettingApp_AuditReport.md"
    with open(report_file, "w", encoding="utf-8") as f:
        f.write(report)
    print(f"Audit complete! Report saved to {report_file}")
