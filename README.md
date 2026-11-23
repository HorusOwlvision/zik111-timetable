# ЗиК-111 · расписание УрГАУ

Проверка официального расписания раз в день в **17:17 по Екатеринбургу** (`17 12 * * *` UTC).

- Источник: https://urgau.ru/raspisanie-zanyatij-2
- Запасной URL: https://urgau.ru/images/Raspisanie/AGRO/rasp_agr1.pdf
- Группа: **ЗиК-111**, 1 курс очной формы.
- Данные: `data/schedule.json` — JSON для Scriptable.

## Запуск

`Actions` → `Check UrGAU timetable daily` → `Run workflow`. Для публикации JSON процессу нужны права записи (в `.github/workflows/daily.yml` прописано `permissions: contents: write`, в настройках репозитория это не должно быть запрещено).

При ошибке загрузки или разбора PDF предыдущая версия JSON остаётся неизменной. При появлении следующей недели текущая сохраняется до завершения.

Проверка локальным файлом:

```bash
pip install -r requirements.txt
python update_schedule.py --pdf-file sample.pdf
```

**Публичный репозиторий содержит только общеуниверситетское расписание**, личные данные или пароли не нужны.
