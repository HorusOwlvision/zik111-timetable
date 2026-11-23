#!/usr/bin/env python3
"""Раз в день извлекает ЗиК-111 из первого курса УрГАУ и обновляет JSON для виджетов.

Данные публикуются только после проверки PDF: период, группа, непустые ячейки.
Если загрузка/парсинг ломается, существующий файл не перезаписывается.
"""
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
# Резервный адрес подтверждён таблицей «1 курс» на сайте УрГАУ.
PDF_FALLBACK = "https://urgau.ru/images/Raspisanie/AGRO/rasp_agr1.pdf"
TZ = ZoneInfo("Asia/Yekaterinburg")
DAY_MAP = {"пн": 0, "вт": 1, "ср": 2, "чт": 3, "пт": 4, "сб": 5, "вс": 6}
DATE_PATTERN = re.compile(r"(?:период\s+)?с\s*(\d{2}\.\d{2}\.\d{4})\s*по\s*(\d{2}\.\d{2}\.\d{4})", re.I)
TIME_PATTERN = re.compile(r"(\d{1,2}:\d{2})\s*[-–—]\s*(\d{1,2}:\d{2})")
TYPE_PATTERN = re.compile(r"\((Лек|Пр|Лаб|ГК|Гк|Зач|Экз)\)", re.I)
ROOM_PATTERN = re.compile(r"/\s*([A-Za-zА-Яа-я]?\d{3,5}[A-Za-zА-Яа-я]?)\s*$")


def normal(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip()


def extract_pdf_url(html: str, base_url: str = PAGE_URL) -> str:
    """Берёт первую ссылку (1 курс) из строки «Землеустройство и кадастры»."""
    soup = BeautifulSoup(html, "html.parser")
    for row in soup.find_all("tr"):
        cells = row.find_all(["td", "th"], recursive=False)
        if len(cells) < 2 or "землеустройство и кадастры" not in normal(cells[0].get_text(" ", strip=True)).lower():
            continue
        for a in cells[1].find_all("a", href=True):
            candidate = urljoin(base_url, a["href"])
            u = urlparse(candidate)
            if u.scheme == "https" and u.hostname in ("urgau.ru", "sb.urgau.ru") and u.path.lower().endswith(".pdf"):
                return candidate
    raise ValueError("На сайте не найдена PDF-ссылка для ЗиК первого курса")


def fetch_pdf(session, url: str) -> bytes:
    res = session.get(url, timeout=35, headers={"User-Agent": "Mozilla/5.0 (schedule-widget; educational use)", "Accept": "application/pdf,*/*"})
    res.raise_for_status()
    if len(res.content) > 20_000_000 or not res.content.startswith(b"%PDF-"):
        raise ValueError("Сайт вернул не PDF или слишком большой файл")
    return res.content


def parse_pdf(pdf_bytes: bytes, source_url: str) -> dict:
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as document:
        text = "\n".join(page.extract_text() or "" for page in document.pages)
        compact = normal(text)
        matched = DATE_PATTERN.search(compact)
        if not matched:
            raise ValueError("Не найден период расписания с DD.MM.YYYY по DD.MM.YYYY")
        start = datetime.strptime(matched.group(1), "%d.%m.%Y").date()
        end = datetime.strptime(matched.group(2), "%d.%m.%Y").date()
        if end < start or end - start > timedelta(days=13):
            raise ValueError(f"Некорректный интервал в PDF: {start}—{end}")

        lessons: list[dict] = []
        for page in document.pages:
            for table in page.extract_tables() or []:
                if not table:
                    continue
                header_index = -1
                group_column = None
                for idx, row in enumerate(table):
                    if not row:
                        continue
                    for col, cell in enumerate(row):
                        if re.search(r"зи\s*к\s*[-‐‑–]?\s*111", normal(cell).lower(), re.I):
                            header_index, group_column = idx, col
                            break
                    if group_column is not None:
                        break
                if group_column is None:
                    continue
                active_weekday = None
                for row in table[header_index + 1:]:
                    if len(row) <= group_column or len(row) < 3:
                        continue
                    wd = normal(row[0]).lower()
                    if wd in DAY_MAP:
                        active_weekday = DAY_MAP[wd]
                    if active_weekday is None:
                        continue
                    number = normal(row[1])
                    time = TIME_PATTERN.search(normal(row[2]))
                    cell = normal(row[group_column])
                    if not (number.isdigit() and time and cell):
                        continue
                    type_match = TYPE_PATTERN.search(cell)
                    if not type_match:
                        raise ValueError(f"Не распознан тип пары для №{number}: {cell[:100]}")
                    subject = normal(cell[:type_match.start()]).strip(" -:")
                    if not subject:
                        raise ValueError(f"Не найдено название предмета: {cell}")
                    kind = type_match.group(1).capitalize()
                    room_match = ROOM_PATTERN.search(cell)
                    room = room_match.group(1) if room_match else "—"
                    # Интервал начинается с понедельника, поэтому day_of_week соответствует дню недели PDF.
                    monday = start - timedelta(days=start.weekday())
                    lesson_date = monday + timedelta(days=active_weekday)
                    if not start <= lesson_date <= end:
                        continue
                    lessons.append({
                        "date": lesson_date.isoformat(), "number": int(number),
                        "start": time.group(1).zfill(5), "end": time.group(2).zfill(5),
                        "subject": subject, "type": kind, "room": room
                    })
        if not lessons:
            raise ValueError("Группа ЗиК-111 не найдена или расписание пусто — данные не публикуем")

        seen = set()
        clean = []
        for x in sorted(lessons, key=lambda o: (o["date"], o["start"], o["number"])):
            key = (x["date"], x["number"])
            if key in seen:
                raise ValueError(f"Повтор пары {key} — структура PDF изменилась")
            seen.add(key)
            if x["end"] <= x["start"]:
                raise ValueError(f"Неверное время пары: {x}")
            clean.append(x)

        return {
            "start": start.isoformat(), "end": end.isoformat(),
            "source_url": source_url, "lessons": clean,
        }


def combine(previous: dict, new_week: dict, today: date) -> dict:
    weeks = {w["start"]: w for w in previous.get("weeks", [])
             if isinstance(w, dict) and w.get("start") and w.get("end") and w.get("lessons")}
    weeks[new_week["start"]] = new_week
    # Держим ещё актуальную неделю и следующую, но не используем истекшие недели.
    retained = [w for w in weeks.values() if date.fromisoformat(w["end"]) >= today - timedelta(days=1)]
    retained.sort(key=lambda w: w["start"])
    return {
        "schema_version": 1,
        "group": "ЗиК-111",
        "timezone": "Asia/Yekaterinburg",
        "checked_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "weeks": retained[-6:]
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="data/schedule.json")
    parser.add_argument("--pdf-file", help="Для офлайн-проверки вместо скачивания")
    opts = parser.parse_args()
    path = Path(opts.output)
    previous = json.loads(path.read_text(encoding="utf-8")) if path.exists() else {"weeks": []}
    source_url = "local-pdf-test" if opts.pdf_file else PDF_FALLBACK
    if opts.pdf_file:
        contents = Path(opts.pdf_file).read_bytes()
    else:
        s = requests.Session()
        try:
            page = s.get(PAGE_URL, timeout=25, headers={"User-Agent": "Mozilla/5.0"})
            page.raise_for_status()
            source_url = extract_pdf_url(page.text)
        except (requests.RequestException, ValueError) as exc:
            print(f"Веб-страница недоступна, использую подтверждённый PDF-адрес: {exc}")
        contents = fetch_pdf(s, source_url)
    week = parse_pdf(contents, source_url)
    now = datetime.now(TZ).date()
    if not opts.pdf_file and (date.fromisoformat(week["end"]) < now - timedelta(days=1)):
        raise ValueError(f"На сайте опубликован устаревший PDF: до {week['end']}; JSON не меняем")
    result = combine(previous, week, now)
    # Сохраняем атомарно после всех проверок, при ошибках предыдущий файл остаётся целым.
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix(".json.tmp")
    temp.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temp.replace(path)
    print(f"OK: {week['start']}—{week['end']}, {len(week['lessons'])} пар, всего недель {len(result['weeks'])}")

if __name__ == "__main__":
    main()
