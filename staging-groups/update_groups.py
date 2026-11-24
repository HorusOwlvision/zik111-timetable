from __future__ import annotations

import argparse
import io
import json
import re
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse
from zoneinfo import ZoneInfo

import pdfplumber
import requests
from bs4 import BeautifulSoup

PAGE_URL = "https://urgau.ru/raspisanie-zanyatij-2"
PDF_FALLBACK = "https://urgau.ru/images/Raspisanie/AGRO/rasp_agr1.pdf"
GROUPS = {
    "А-111": "Агрономия",
    "АА-111": "Агрохимия и агропочвоведение",
    "ЗиК-111": "Землеустройство и кадастры",
    "ЛА-111": "Ландшафтная архитектура",
    "ЛА-112": "Ландшафтная архитектура",
    "С-111": "Садоводство",
}
TZ = ZoneInfo("Asia/Yekaterinburg")
DAY_MAP = {"пн": 0, "вт": 1, "ср": 2, "чт": 3, "пт": 4, "сб": 5, "вс": 6}
DATE_PATTERN = re.compile(r"(?:период\s+)?с\s*(\d{2}\.\d{2}\.\d{4})\s*по\s*(\d{2}\.\d{2}\.\d{4})", re.I)
TIME_PATTERN = re.compile(r"(\d{1,2}:\d{2})\s*[-–—]\s*(\d{1,2}:\d{2})")
TYPE_PATTERN = re.compile(r"\((Лек|Пр|Лаб|ГК|Зач|Экз)\)", re.I)
ROOM_PATTERN = re.compile(r"/\s*([A-Za-zА-Яа-я]?\d{3,5}[A-Za-zА-Яа-я]?)\s*$")


def clean(text: str | None) -> str:
    return re.sub(r"\s+", " ", text or "").strip()


def extract_pdf_url(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")
    for row in soup.find_all("tr"):
        cells = row.find_all(["td", "th"], recursive=False)
        if len(cells) < 2 or "землеустройство и кадастры" not in clean(cells[0].get_text(" ", strip=True)).lower():
            continue
        for tag in cells[1].find_all("a", href=True):
            url = urljoin(PAGE_URL, tag["href"])
            parsed = urlparse(url)
            if parsed.scheme == "https" and parsed.hostname in ("urgau.ru", "sb.urgau.ru") and parsed.path.lower().endswith(".pdf"):
                return url
    raise ValueError("Нет PDF первого курса на странице")


def parse_pdf(contents: bytes, source: str) -> dict:
    groups = {key: [] for key in GROUPS}
    with pdfplumber.open(io.BytesIO(contents)) as document:
        period_text = clean(" ".join(page.extract_text() or "" for page in document.pages))
        found = DATE_PATTERN.search(period_text)
        if not found:
            raise ValueError("В PDF не найден период")
        start = datetime.strptime(found.group(1), "%d.%m.%Y").date()
        end = datetime.strptime(found.group(2), "%d.%m.%Y").date()
        if end < start or end - start > timedelta(days=13):
            raise ValueError("Неожиданная длина недели")
        monday = start - timedelta(days=start.weekday())
        matched_table = False
        for page in document.pages:
            for table in page.extract_tables() or []:
                headers = None
                header_row = -1
                for i, row in enumerate(table):
                    if row and len(row) >= 9 and all(key in [clean(c) for c in row] for key in GROUPS):
                        headers = {key: [clean(c) for c in row].index(key) for key in GROUPS}
                        header_row = i
                        break
                if headers is None:
                    continue
                matched_table = True
                active_day = None
                for row in table[header_row + 1:]:
                    if not row or len(row) < 3:
                        continue
                    marker = clean(row[0]).lower()
                    if marker in DAY_MAP:
                        active_day = DAY_MAP[marker]
                    if active_day is None:
                        continue
                    number = clean(row[1])
                    time = TIME_PATTERN.search(clean(row[2]))
                    if not (number.isdigit() and time):
                        continue
                    lesson_day = monday + timedelta(days=active_day)
                    if not start <= lesson_day <= end:
                        continue
                    for group, col in headers.items():
                        cell = clean(row[col] if col < len(row) else None)
                        if not cell:
                            continue
                        typem = TYPE_PATTERN.search(cell)
                        if not typem:
                            raise ValueError(f"Не распознан тип: {group} №{number}: {cell[:80]}")
                        subject = clean(cell[:typem.start()]).strip(" -:")
                        if not subject:
                            raise ValueError(f"Нет предмета: {group}")
                        roomm = ROOM_PATTERN.search(cell)
                        groups[group].append({
                            "date": lesson_day.isoformat(), "number": int(number),
                            "start": time.group(1).zfill(5), "end": time.group(2).zfill(5),
                            "subject": subject, "type": typem.group(1).capitalize(),
                            "room": roomm.group(1) if roomm else "—",
                        })
    if not matched_table:
        raise ValueError("Нет таблицы с шестью группами")
    output = {}
    for key, lessons in groups.items():
        if not lessons:
            raise ValueError(f"Пустое расписание группы {key}")
        seen = set()
        sorted_lessons = sorted(lessons, key=lambda item: (item["date"], item["start"], item["number"]))
        for lesson in sorted_lessons:
            ident = lesson["date"], lesson["number"]
            if ident in seen or lesson["end"] <= lesson["start"]:
                raise ValueError(f"Повтор или неверное время: {key}, {ident}")
            seen.add(ident)
        output[key] = {"start": start.isoformat(), "end": end.isoformat(), "source_url": source, "lessons": sorted_lessons}
    return output


def merge(old: dict, parsed: dict, today: date) -> dict:
    result = {}
    for group, title in GROUPS.items():
        old_weeks = old.get("groups", {}).get(group, {}).get("weeks", [])
        weeks = {w["start"]: w for w in old_weeks if isinstance(w, dict) and w.get("start") and w.get("end") and w.get("lessons")}
        week = parsed[group]
        weeks[week["start"]] = week
        current = [w for w in weeks.values() if date.fromisoformat(w["end"]) >= today - timedelta(days=1)]
        current.sort(key=lambda w: w["start"])
        result[group] = {"title": title, "weeks": current[-6:]}
    return {"schema_version": 2, "timezone": "Asia/Yekaterinburg", "checked_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"), "groups": result}


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--output", default="data/staging_groups.json")
    p.add_argument("--pdf-file")
    p.add_argument("--keep-reference-week", action="store_true")
    args = p.parse_args()
    out = Path(args.output)
    previous = json.loads(out.read_text(encoding="utf-8")) if out.exists() else {}
    if args.pdf_file:
        contents = Path(args.pdf_file).read_bytes()
        source_url = "reference-pdf-2026-11-23"
    else:
        sess = requests.Session()
        try:
            response = sess.get(PAGE_URL, timeout=25, headers={"User-Agent": "Mozilla/5.0"})
            response.raise_for_status()
            source_url = extract_pdf_url(response.text)
        except (requests.RequestException, ValueError):
            source_url = PDF_FALLBACK
        response = sess.get(source_url, timeout=35, headers={"User-Agent": "Mozilla/5.0"})
        response.raise_for_status()
        contents = response.content
        if len(contents) > 20_000_000 or not contents.startswith(b"%PDF-"):
            raise ValueError("Ответ сервера не является PDF")
    parsed = parse_pdf(contents, source_url)
    today = date(2026, 11, 24) if args.keep_reference_week else datetime.now(TZ).date()
    if not args.pdf_file and date.fromisoformat(parsed["ЗиК-111"]["end"]) < today - timedelta(days=1):
        raise ValueError("PDF на сайте устарел, данные не перезаписываем")
    result = merge(previous, parsed, today)
    out.parent.mkdir(parents=True, exist_ok=True)
    temp = out.with_suffix(out.suffix + ".tmp")
    temp.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temp.replace(out)
    print("OK", result["checked_at"], {g: len(x["weeks"][-1]["lessons"]) if x["weeks"] else 0 for g, x in result["groups"].items()})


if __name__ == "__main__":
    main()
