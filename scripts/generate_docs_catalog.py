#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import re
import shutil
import textwrap
from collections import Counter
from pathlib import Path


SITE_ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = SITE_ROOT.parent.parent
PDF_ROOT = SITE_ROOT / "assets" / "docs" / "pdf"
CATALOG_OUT = SITE_ROOT / "assets" / "js" / "data" / "docs-catalog.js"
LOCAL_DOCS_ROOT = SITE_ROOT / "assets" / "docs" / "source" / "Docs"
ATHO_BETA_DOCS_ROOT = REPO_ROOT / "Atho-Beta-main" / "docs"
LEGACY_DOCS_ROOT = REPO_ROOT / "docs"


def resolve_docs_root() -> Path:
    env_root = os.getenv("ATHO_DOCS_ROOT")
    candidates = []
    if env_root:
        candidates.append(Path(env_root).expanduser())
    candidates.extend([ATHO_BETA_DOCS_ROOT, LOCAL_DOCS_ROOT, LEGACY_DOCS_ROOT])
    for candidate in candidates:
        if candidate.exists() and candidate.is_dir():
            return candidate.resolve()
    locations = "\n".join(f"  - {p}" for p in candidates)
    raise SystemExit(f"Missing docs root. Checked:\\n{locations}")


DOCS_ROOT = resolve_docs_root()

INCLUDE_EXT = {".md", ".txt", ".csv", ".json", ".pdf"}
DATE_RE = re.compile(r"\b\d{4}[-_ ]\d{2}[-_ ]\d{2}\b")
WORD_RE = re.compile(r"[a-z0-9][a-z0-9\-\+]{2,}")
STOPWORDS = {
    "the",
    "and",
    "for",
    "with",
    "from",
    "that",
    "this",
    "are",
    "was",
    "were",
    "into",
    "your",
    "have",
    "has",
    "not",
    "use",
    "using",
    "all",
    "any",
    "can",
    "will",
    "when",
    "why",
    "how",
    "what",
    "where",
    "which",
    "than",
    "also",
    "docs",
    "atho",
}

KEYWORD_ALIASES = {
    "falcon": ["falcon-512", "post-quantum", "signature", "nist"],
    "kyber": ["kyber", "pqc", "kem", "wallet security"],
    "sha3": ["sha3-384", "sha3-256", "hashing", "hpk", "txid"],
    "sigwit": ["segwit", "witness", "transaction weight", "vsize"],
    "consensus": ["pow", "retarget", "difficulty", "mtp", "finality"],
    "quickstart": ["setup", "install", "join", "run node", "api key"],
    "troubleshooting": ["errors", "recovery", "fixes", "logs"],
    "emissions": ["tokenomics", "supply", "tail emission", "deflation", "utilization"],
    "keymanager": ["mnemonic", "wallet", "encryption", "aes-256-gcm"],
    "apiauth": ["api password", "auth", "permissions", "hmac"],
}


def markdown_to_plain(text: str) -> str:
    text = re.sub(r"```.*?```", "\n", text, flags=re.DOTALL)
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"`([^`]+)`", r"\1", text)
    text = re.sub(r"^#{1,6}\s*", "", text, flags=re.MULTILINE)
    text = re.sub(r"^\s*[-*+]\s+", "- ", text, flags=re.MULTILINE)
    text = re.sub(r"^\s*\d+(\.|\))\s+", "- ", text, flags=re.MULTILINE)
    return text.strip()


def normalize_title(raw: str) -> str:
    raw = raw.replace("_", " ").replace("-", " ")
    raw = DATE_RE.sub("", raw)
    raw = re.sub(r"\s+", " ", raw).strip()
    if not raw:
        return "Atho Reference"

    upper_terms = {
        "api": "API",
        "cli": "CLI",
        "gui": "GUI",
        "lmdb": "LMDB",
        "tx": "TX",
        "txid": "TXID",
        "utxo": "UTXO",
        "pow": "PoW",
        "sha3": "SHA3",
        "hpk": "HPK",
        "json": "JSON",
        "csv": "CSV",
        "pdf": "PDF",
        "aes": "AES",
        "kyber": "Kyber",
        "falcon": "Falcon",
        "sigwit": "SegWit",
        "tps": "TPS",
    }

    parts = []
    for token in raw.split():
        key = token.lower()
        parts.append(upper_terms.get(key, token.capitalize()))
    return " ".join(parts)


def slugify(raw: str) -> str:
    raw = raw.replace("_", " ").replace("-", " ")
    raw = DATE_RE.sub("", raw)
    raw = re.sub(r"[^a-zA-Z0-9]+", "-", raw).strip("-").lower()
    raw = re.sub(r"-{2,}", "-", raw)
    return raw or "atho-reference"


def categorize(path: Path) -> str:
    name = path.name.lower()
    rel = path.as_posix().lower()
    if "whitepaper" in rel:
        return "Whitepaper"
    if any(token in rel for token in ("emissions", "inflation", "tokenomics")):
        return "Economics"
    if any(token in rel for token in ("quickstart", "onboarding", "troubleshooting", "docker", "packaging", "node_stop", "node-stop")):
        return "Node Ops"
    if any(token in rel for token in ("consensus", "tx", "sigwit", "lmdb", "src_file_map", "genesis")):
        return "Core Protocol"
    if any(token in rel for token in ("apiauth", "threat", "falcon", "sha3", "base56", "keymanager", "mnemonic", "binaries", "kyber")):
        return "Security"
    if "readme" in name:
        return "Index"
    return "Reference"


def extract_headings(text: str) -> list[str]:
    headings: list[str] = []
    for line in text.splitlines():
        striped = line.strip()
        if striped.startswith("## "):
            headings.append(striped[3:].strip())
        elif striped.startswith("### "):
            headings.append(striped[4:].strip())
        if len(headings) >= 6:
            break
    return headings


def summarize(text: str, fallback: str) -> str:
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        if line.startswith("#") or line.startswith("```"):
            continue
        if line.count(",") >= 3:
            continue
        if len(line) > 180 and " " not in line[:120]:
            continue
        if len(line) >= 36:
            return re.sub(r"\s+", " ", line)[:280]
    return fallback


def extract_keywords(text: str, extra: list[str]) -> list[str]:
    words = [w for w in WORD_RE.findall(text.lower()) if w not in STOPWORDS and not w.isdigit()]
    top = [word for word, _ in Counter(words).most_common(24)]
    merged = list(dict.fromkeys([*extra, *top]))
    return merged[:32]


def infer_aliases(path: Path) -> list[str]:
    joined = f"{path.name.lower()} {path.as_posix().lower()}"
    aliases: list[str] = []
    for key, vals in KEYWORD_ALIASES.items():
        if key in joined:
            aliases.extend(vals)
    return aliases


def escape_pdf_text(text: str) -> str:
    return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def write_text_pdf(text: str, out_path: Path) -> None:
    lines: list[str] = []
    for paragraph in text.splitlines():
        stripped = paragraph.rstrip()
        if not stripped:
            lines.append("")
            continue
        wrapped = textwrap.wrap(stripped, width=96, break_long_words=True, break_on_hyphens=False)
        lines.extend(wrapped if wrapped else [""])

    if not lines:
        lines = ["Atho documentation artifact."]

    lines_per_page = 52
    pages = [lines[i : i + lines_per_page] for i in range(0, len(lines), lines_per_page)]

    objects: dict[int, bytes] = {}
    objects[1] = b"<< /Type /Catalog /Pages 2 0 R >>"

    page_ids: list[int] = []
    content_ids: list[int] = []
    obj_id = 4
    for _ in pages:
        page_ids.append(obj_id)
        content_ids.append(obj_id + 1)
        obj_id += 2

    kids = " ".join(f"{page_id} 0 R" for page_id in page_ids)
    objects[2] = f"<< /Type /Pages /Count {len(page_ids)} /Kids [{kids}] >>".encode("ascii")
    objects[3] = b"<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>"

    for page_id, content_id, page_lines in zip(page_ids, content_ids, pages):
        stream_lines = ["BT", "/F1 10 Tf", "50 760 Td", "13 TL"]
        for line in page_lines:
            stream_lines.append(f"({escape_pdf_text(line)}) Tj")
            stream_lines.append("T*")
        stream_lines.append("ET")
        stream = "\n".join(stream_lines).encode("latin-1", "replace")

        objects[page_id] = (
            f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
            f"/Resources << /Font << /F1 3 0 R >> >> /Contents {content_id} 0 R >>"
        ).encode("ascii")
        objects[content_id] = b"<< /Length " + str(len(stream)).encode("ascii") + b" >>\nstream\n" + stream + b"\nendstream"

    max_id = max(objects)
    blob = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
    offsets = [0] * (max_id + 1)

    for idx in range(1, max_id + 1):
        offsets[idx] = len(blob)
        blob += f"{idx} 0 obj\n".encode("ascii")
        blob += objects[idx]
        blob += b"\nendobj\n"

    xref = len(blob)
    blob += f"xref\n0 {max_id + 1}\n".encode("ascii")
    blob += b"0000000000 65535 f \n"
    for idx in range(1, max_id + 1):
        blob += f"{offsets[idx]:010d} 00000 n \n".encode("ascii")
    blob += f"trailer\n<< /Size {max_id + 1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF\n".encode("ascii")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_bytes(bytes(blob))


def generate_pdf_artifact(source: Path, out_path: Path) -> None:
    if source.suffix.lower() == ".pdf":
        shutil.copyfile(source, out_path)
        return

    raw = source.read_text(encoding="utf-8", errors="ignore")
    if source.suffix.lower() == ".md":
        raw = markdown_to_plain(raw)
    write_text_pdf(raw, out_path)


def source_files() -> list[Path]:
    paths: list[Path] = []
    for path in sorted(DOCS_ROOT.rglob("*")):
        if not path.is_file():
            continue
        if path.name.startswith("."):
            continue
        if path.suffix.lower() not in INCLUDE_EXT:
            continue
        if "core_whitepaper_compact" in path.name.lower():
            continue
        if "Whitepaper_Assets" in path.as_posix():
            continue
        rel = path.relative_to(DOCS_ROOT)
        rel_posix = rel.as_posix()
        if rel_posix.startswith("Emissions Modeling/") and path.name != "Entire_Overview.md":
            continue
        if rel_posix.startswith("Genesis/"):
            continue
        if "Consensus_Verification_Grade_Audit" in path.name:
            continue
        if path.name == "SRC_FILE_MAP.md":
            continue
        if path.name == "inflation-deflationary.pdf":
            continue
        if path.stem == "Inflation_Deflationary":
            continue
        paths.append(path)
    return paths


def build_catalog() -> list[dict[str, object]]:
    PDF_ROOT.mkdir(parents=True, exist_ok=True)
    for stale in PDF_ROOT.glob("*.pdf"):
        stale.unlink(missing_ok=True)

    # Prefer editable text sources over bundled PDFs so the site reflects the
    # latest docs-tree updates instead of older prebuilt exports.
    priority = {".md": 0, ".txt": 1, ".csv": 2, ".json": 3, ".pdf": 4}
    selected_by_slug: dict[str, Path] = {}

    for source in source_files():
        rel = source.relative_to(DOCS_ROOT)
        raw_title = " ".join(rel.with_suffix("").parts)
        slug = slugify(raw_title)
        existing = selected_by_slug.get(slug)
        if existing is None:
            selected_by_slug[slug] = source
            continue

        old_rank = priority.get(existing.suffix.lower(), 99)
        new_rank = priority.get(source.suffix.lower(), 99)
        if new_rank < old_rank:
            selected_by_slug[slug] = source

    entries: list[dict[str, object]] = []

    for slug, source in sorted(selected_by_slug.items(), key=lambda item: item[0]):
        rel = source.relative_to(DOCS_ROOT)
        raw_title = " ".join(rel.with_suffix("").parts)
        title = normalize_title(raw_title)

        out_pdf = PDF_ROOT / f"{slug}.pdf"
        generate_pdf_artifact(source, out_pdf)

        text = ""
        if source.suffix.lower() in {".md", ".txt", ".csv", ".json"}:
            text = source.read_text(encoding="utf-8", errors="ignore")
        headings = extract_headings(text) if source.suffix.lower() == ".md" else []
        category = categorize(source)
        suffix = source.suffix.lower()
        if suffix == ".csv":
            summary = f"Atho data table reference: {title}."
        elif suffix == ".json":
            summary = f"Atho JSON reference: {title}."
        else:
            summary = summarize(markdown_to_plain(text) if suffix == ".md" else text, f"Atho reference: {title}.")
        aliases = infer_aliases(source)
        keywords = extract_keywords(" ".join([title, summary, *headings, *aliases, text[:6000]]), aliases)

        entries.append(
            {
                "title": title,
                "category": category,
                "summary": summary,
                "headings": headings,
                "keywords": keywords,
                "source": out_pdf.name,
                "type": "PDF",
                "href": f"./assets/docs/pdf/{out_pdf.name}",
            }
        )

    entries.append(
        {
            "title": "Falcon Reference (Official)",
            "category": "References",
            "summary": "Official Falcon project reference for the post-quantum signature scheme used in Atho.",
            "headings": [],
            "keywords": ["falcon", "nist", "post-quantum", "signature", "reference"],
            "source": "External",
            "type": "External",
            "href": "https://falcon-sign.info/",
        }
    )
    entries.append(
        {
            "title": "CRYSTALS-Kyber Reference (Official)",
            "category": "References",
            "summary": "Official CRYSTALS-Kyber reference for KEM architecture integrated in Atho key protection flows.",
            "headings": [],
            "keywords": ["kyber", "crystals", "post-quantum", "kem", "reference"],
            "source": "External",
            "type": "External",
            "href": "https://pq-crystals.org/kyber/",
        }
    )

    order = {
        "Whitepaper": 0,
        "Index": 1,
        "Node Ops": 2,
        "Core Protocol": 3,
        "Security": 4,
        "Economics": 5,
        "Reference": 6,
        "References": 7,
    }
    entries.sort(key=lambda item: (order.get(str(item["category"]), 99), str(item["title"]).lower()))
    return entries


def main() -> int:
    if not DOCS_ROOT.exists():
        raise SystemExit(f"Missing docs root: {DOCS_ROOT}")

    entries = build_catalog()
    CATALOG_OUT.parent.mkdir(parents=True, exist_ok=True)
    CATALOG_OUT.write_text(
        "export const docsCatalog = " + json.dumps(entries, ensure_ascii=True, indent=2) + ";\n",
        encoding="utf-8",
    )
    print(f"[generate_docs_catalog] wrote {CATALOG_OUT} with {len(entries)} entries")
    print(f"[generate_docs_catalog] generated PDFs in {PDF_ROOT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
