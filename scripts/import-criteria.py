"""
One-off importer: jaewoo001/hirescope criteria markdown -> our role library.

Their criteria files are the assessment standard for a role, written by hand and
already reviewed. Rather than paraphrasing them we parse them, so the wording a
candidate is judged against is theirs, unchanged.
"""
import json, os, re, sys

SRC = sys.argv[1] if len(sys.argv) > 1 else "/home/user/jaewoo001/hirescope/criteria"
OUT = sys.argv[2] if len(sys.argv) > 2 else "lib/sample/roleLibrary.ts"

SKIP = {"README.md", "_TEMPLATE.md"}

def parse_front(text):
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if not m:
        return {}, text
    front = {}
    for line in m.group(1).split("\n"):
        if ":" in line:
            k, v = line.split(":", 1)
            front[k.strip()] = v.strip()
    return front, text[m.end():]

def section_body(block, heading):
    """Text under **heading** up to the next ** heading ** or end."""
    m = re.search(r"\*\*" + re.escape(heading) + r"\*\*\n+(.*?)(?=\n\*\*[A-Z]|\Z)", block, re.S)
    return re.sub(r"\s+", " ", m.group(1)).strip() if m else ""

roles = []
for name in sorted(os.listdir(SRC)):
    if not name.endswith(".md") or name in SKIP:
        continue
    text = open(os.path.join(SRC, name)).read()
    front, body = parse_front(text)

    blocks = re.split(r"^## ", body, flags=re.M)[1:]
    competencies = []
    for b in blocks:
        key = b.split("\n", 1)[0].strip()
        label = re.search(r"\*\*Name:\*\*\s*(.+)", b)
        priority = re.search(r"\*\*Priority:\*\*\s*(\w+)", b)
        if not (label and priority):
            continue
        competencies.append({
            "key": key,
            "label": label.group(1).strip(),
            "priority": priority.group(1).strip().lower(),
            "description": section_body(b, "What it means"),
            "strongAnswer": section_body(b, "A strong answer"),
            "weakAnswer": section_body(b, "A weak answer"),
        })

    if not competencies:
        print(f"  skipped {name}: no competencies parsed", file=sys.stderr)
        continue

    roles.append({
        "slug": front.get("roleSlug", name[:-3]),
        "title": front.get("roleTitle", name[:-3]),
        "sector": front.get("sector", "other"),
        "competencies": competencies,
    })

header = '''import type { RoleTemplate } from "../types";

/**
 * The role library.
 *
 * Generated from the criteria files in jaewoo001/hirescope by
 * scripts/import-criteria.py — the wording is theirs, parsed rather than
 * paraphrased, so a candidate is judged against the standard as written and
 * reviewed. Re-run the script to pull changes; do not hand-edit this file.
 *
 * A role template is a starting point, not a lock: adding a department copies
 * these competencies into the store, where they are editable like any other.
 */
export const ROLE_LIBRARY: RoleTemplate[] = '''

with open(OUT, "w") as f:
    f.write(header + json.dumps(roles, indent=2, ensure_ascii=False) + ";\n")

print(f"{len(roles)} roles, {sum(len(r['competencies']) for r in roles)} competencies -> {OUT}")
for r in roles:
    print(f"  {r['slug']}: {len(r['competencies'])} competencies")
