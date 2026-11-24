module.exports = async function zik111WidgetRun() {


const TIMEZONE_HOURS = 5;
const EMBEDDED = {"schema_version":1,"group":"ЗиК-111","timezone":"Asia/Yekaterinburg","weeks":[{"start":"2026-11-23","end":"2026-11-28","source_url":"pdf-from-user-2026-11-23","lessons":[{"date":"2026-11-23","number":2,"start":"10:40","end":"12:10","subject":"Физика","type":"Пр","room":"1406"},{"date":"2026-11-23","number":3,"start":"12:20","end":"13:50","subject":"Основы российской государственности","type":"Лек","room":"1402"},{"date":"2026-11-23","number":4,"start":"14:30","end":"16:05","subject":"Культура речи и деловые коммуникации","type":"Лек","room":"1402"},{"date":"2026-11-23","number":5,"start":"16:15","end":"17:50","subject":"История России","type":"Лек","room":"1402"},{"date":"2026-11-24","number":4,"start":"14:30","end":"16:05","subject":"История России","type":"Лек","room":"1402"},{"date":"2026-11-24","number":5,"start":"16:15","end":"17:50","subject":"История России","type":"Лек","room":"1402"},{"date":"2026-11-25","number":1,"start":"09:00","end":"10:30","subject":"Основы российской государственности","type":"Пр","room":"4517"},{"date":"2026-11-25","number":2,"start":"10:40","end":"12:10","subject":"История России","type":"Пр","room":"4316"},{"date":"2026-11-26","number":1,"start":"09:00","end":"10:30","subject":"Математика","type":"Пр","room":"5215"},{"date":"2026-11-26","number":2,"start":"10:40","end":"12:10","subject":"Математика","type":"Пр","room":"4517"},{"date":"2026-11-26","number":3,"start":"12:20","end":"13:50","subject":"Иностранный язык","type":"Пр","room":"4316"},{"date":"2026-11-26","number":4,"start":"14:30","end":"16:05","subject":"Культура речи и деловые коммуникации","type":"Пр","room":"4513"},{"date":"2026-11-26","number":5,"start":"16:15","end":"17:50","subject":"Иностранный язык","type":"Пр","room":"4508"},{"date":"2026-11-27","number":1,"start":"09:00","end":"10:30","subject":"История России","type":"Пр","room":"4517"},{"date":"2026-11-27","number":2,"start":"10:40","end":"12:10","subject":"Физическая культура и спорт","type":"Пр","room":"4237"}]}]};

const fm = FileManager.local();
const configPath = fm.joinPath(fm.documentsDirectory(), "zik111_config.json");
const cachePath = fm.joinPath(fm.documentsDirectory(), "zik111_data_cache.json");
const UPDATE_MS = 3 * 60 * 60 * 1000;

const GROUPS = [
  {id:'А-111', title:'Агрономия'},
  {id:'АА-111', title:'Агрохимия и агропочвоведение'},
  {id:'ЗиК-111', title:'Землеустройство и кадастры'},
  {id:'ЛА-111', title:'Ландшафтная архитектура'},
  {id:'ЛА-112', title:'Ландшафтная архитектура'},
  {id:'С-111', title:'Садоводство'}
];
const STAGING_GROUPS_URL = 'https://raw.githubusercontent.com/HorusOwlvision/zik111-timetable/main/data/staging_groups.json';
const GROUP_CHOICE_FILE = fm.joinPath(fm.documentsDirectory(), 'zik_staging_group_choice.json');
const GROUP_CACHE_FILE = fm.joinPath(fm.documentsDirectory(), 'zik_staging_groups_cache.json');
const EMBEDDED_GROUPS = {"schema_version":2,"timezone":"Asia/Yekaterinburg","groups":{"А-111":{"title":"Агрономия","weeks":[{"start":"2026-11-23","end":"2026-11-28","source_url":"reference-pdf-2026-11-23","lessons":[{"date":"2026-11-23","number":2,"start":"10:40","end":"12:10","subject":"Культура речи и деловые коммуникации","type":"Пр","room":"5113"},{"date":"2026-11-23","number":3,"start":"12:20","end":"13:50","subject":"Основы российской государственности","type":"Лек","room":"1402"},{"date":"2026-11-23","number":4,"start":"14:30","end":"16:05","subject":"Культура речи и деловые коммуникации","type":"Лек","room":"1402"},{"date":"2026-11-23","number":5,"start":"16:15","end":"17:50","subject":"История России","type":"Лек","room":"1402"},{"date":"2026-11-23","number":6,"start":"18:00","end":"19:35","subject":"История России","type":"Пр","room":"1406"},{"date":"2026-11-24","number":2,"start":"10:40","end":"12:10","subject":"Математика","type":"Пр","room":"4518"},{"date":"2026-11-24","number":3,"start":"12:20","end":"13:50","subject":"Физическая культура и спорт","type":"Пр","room":"4237"},{"date":"2026-11-24","number":4,"start":"14:30","end":"16:05","subject":"История России","type":"Лек","room":"1402"},{"date":"2026-11-24","number":5,"start":"16:15","end":"17:50","subject":"История России","type":"Лек","room":"1402"},{"date":"2026-11-25","number":1,"start":"09:00","end":"10:30","subject":"Математика","type":"Пр","room":"1110"},{"date":"2026-11-25","number":2,"start":"10:40","end":"12:10","subject":"Иностранный язык","type":"Пр","room":"1401"},{"date":"2026-11-25","number":3,"start":"12:20","end":"13:50","subject":"Основы российской государственности","type":"Пр","room":"1401"},{"date":"2026-11-26","number":2,"start":"10:40","end":"12:10","subject":"Сельскохозяйственная экология","type":"Лек","room":"4516"},{"date":"2026-11-26","number":3,"start":"12:20","end":"13:50","subject":"Сельскохозяйственная экология","type":"Гк","room":"4516"},{"date":"2026-11-26","number":4,"start":"14:30","end":"16:05","subject":"История России","type":"Пр","room":"4311"},{"date":"2026-11-26","number":5,"start":"16:15","end":"17:50","subject":"Физика","type":"Пр","room":"1409"},{"date":"2026-11-26","number":6,"start":"18:00","end":"19:35","subject":"Иностранный язык","type":"Пр","room":"4513"},{"date":"2026-11-27","number":1,"start":"09:00","end":"10:30","subject":"Физика","type":"Пр","room":"1409"},{"date":"2026-11-27","number":2,"start":"10:40","end":"12:10","subject":"Основы российской государственности","type":"Пр","room":"4518"}]}]},"АА-111":{"title":"Агрохимия и агропочвоведение","weeks":[{"start":"2026-11-23","end":"2026-11-28","source_url":"reference-pdf-2026-11-23","lessons":[{"date":"2026-11-23","number":3,"start":"12:20","end":"13:50","subject":"Основы российской государственности","type":"Лек","room":"1402"},{"date":"2026-11-23","number":4,"start":"14:30","end":"16:05","subject":"Культура речи и деловые коммуникации","type":"Лек","room":"1402"},{"date":"2026-11-23","number":5,"start":"16:15","end":"17:50","subject":"История России","type":"Лек","room":"1402"},{"date":"2026-11-24","number":2,"start":"10:40","end":"12:10","subject":"История России","type":"Пр","room":"4317"},{"date":"2026-11-24","number":3,"start":"12:20","end":"13:50","subject":"История России","type":"Пр","room":"4317"},{"date":"2026-11-24","number":4,"start":"14:30","end":"16:05","subject":"История России","type":"Лек","room":"1402"},{"date":"2026-11-24","number":5,"start":"16:15","end":"17:50","subject":"История России","type":"Лек","room":"1402"},{"date":"2026-11-25","number":4,"start":"14:30","end":"16:05","subject":"Физическая культура и спорт","type":"Пр","room":"4237"},{"date":"2026-11-25","number":5,"start":"16:15","end":"17:50","subject":"Иностранный язык","type":"Пр","room":"4513"},{"date":"2026-11-25","number":6,"start":"18:00","end":"19:35","subject":"Иностранный язык","type":"Пр","room":"4513"},{"date":"2026-11-26","number":1,"start":"09:00","end":"10:30","subject":"Математика","type":"Пр","room":"5215"},{"date":"2026-11-26","number":2,"start":"10:40","end":"12:10","subject":"Культура речи и деловые коммуникации","type":"Пр","room":"4311"},{"date":"2026-11-26","number":3,"start":"12:20","end":"13:50","subject":"Математика","type":"Пр","room":"4310"},{"date":"2026-11-27","number":1,"start":"09:00","end":"10:30","subject":"Геология с основами геоморфологии и гидрогеологии","type":"Гк","room":"4316"},{"date":"2026-11-27","number":2,"start":"10:40","end":"12:10","subject":"Геология с основами геоморфологии и гидрогеологии","type":"Гк","room":"4316"},{"date":"2026-11-27","number":3,"start":"12:20","end":"13:50","subject":"Основы российской государственности","type":"Пр","room":"4316"},{"date":"2026-11-27","number":4,"start":"14:30","end":"16:05","subject":"Физика","type":"Лаб","room":"1409"},{"date":"2026-11-27","number":5,"start":"16:15","end":"17:50","subject":"Физика","type":"Пр","room":"1409"}]}]},"ЗиК-111":{"title":"Землеустройство и кадастры","weeks":[{"start":"2026-11-23","end":"2026-11-28","source_url":"reference-pdf-2026-11-23","lessons":[{"date":"2026-11-23","number":2,"start":"10:40","end":"12:10","subject":"Физика","type":"Пр","room":"1406"},{"date":"2026-11-23","number":3,"start":"12:20","end":"13:50","subject":"Основы российской государственности","type":"Лек","room":"1402"},{"date":"2026-11-23","number":4,"start":"14:30","end":"16:05","subject":"Культура речи и деловые коммуникации","type":"Лек","room":"1402"},{"date":"2026-11-23","number":5,"start":"16:15","end":"17:50","subject":"История России","type":"Лек","room":"1402"},{"date":"2026-11-24","number":4,"start":"14:30","end":"16:05","subject":"История России","type":"Лек","room":"1402"},{"date":"2026-11-24","number":5,"start":"16:15","end":"17:50","subject":"История России","type":"Лек","room":"1402"},{"date":"2026-11-25","number":1,"start":"09:00","end":"10:30","subject":"Основы российской государственности","type":"Пр","room":"4517"},{"date":"2026-11-25","number":2,"start":"10:40","end":"12:10","subject":"История России","type":"Пр","room":"4316"},{"date":"2026-11-26","number":1,"start":"09:00","end":"10:30","subject":"Математика","type":"Пр","room":"5215"},{"date":"2026-11-26","number":2,"start":"10:40","end":"12:10","subject":"Математика","type":"Пр","room":"4517"},{"date":"2026-11-26","number":3,"start":"12:20","end":"13:50","subject":"Иностранный язык","type":"Пр","room":"4316"},{"date":"2026-11-26","number":4,"start":"14:30","end":"16:05","subject":"Культура речи и деловые коммуникации","type":"Пр","room":"4513"},{"date":"2026-11-26","number":5,"start":"16:15","end":"17:50","subject":"Иностранный язык","type":"Пр","room":"4508"},{"date":"2026-11-27","number":1,"start":"09:00","end":"10:30","subject":"История России","type":"Пр","room":"4517"},{"date":"2026-11-27","number":2,"start":"10:40","end":"12:10","subject":"Физическая культура и спорт","type":"Пр","room":"4237"}]}]},"ЛА-111":{"title":"Ландшафтная архитектура","weeks":[{"start":"2026-11-23","end":"2026-11-28","source_url":"reference-pdf-2026-11-23","lessons":[{"date":"2026-11-23","number":2,"start":"10:40","end":"12:10","subject":"История России","type":"Пр","room":"4516"},{"date":"2026-11-23","number":3,"start":"12:20","end":"13:50","subject":"Основы российской государственности","type":"Лек","room":"1402"},{"date":"2026-11-23","number":4,"start":"14:30","end":"16:05","subject":"Культура речи и деловые коммуникации","type":"Лек","room":"1402"},{"date":"2026-11-23","number":5,"start":"16:15","end":"17:50","subject":"История России","type":"Лек","room":"1402"},{"date":"2026-11-24","number":3,"start":"12:20","end":"13:50","subject":"Физика","type":"Пр","room":"4516"},{"date":"2026-11-24","number":4,"start":"14:30","end":"16:05","subject":"История России","type":"Лек","room":"1402"},{"date":"2026-11-24","number":5,"start":"16:15","end":"17:50","subject":"История России","type":"Лек","room":"1402"},{"date":"2026-11-25","number":2,"start":"10:40","end":"12:10","subject":"Математика","type":"Пр","room":"4517"},{"date":"2026-11-25","number":3,"start":"12:20","end":"13:50","subject":"Физическая культура и спорт","type":"Пр","room":"4237"},{"date":"2026-11-25","number":4,"start":"14:30","end":"16:05","subject":"Иностранный язык","type":"Пр","room":"3208"},{"date":"2026-11-25","number":5,"start":"16:15","end":"17:50","subject":"Иностранный язык","type":"Пр","room":"1401"},{"date":"2026-11-26","number":1,"start":"09:00","end":"10:30","subject":"Сельскохозяйственная экология","type":"Пр","room":"4516"},{"date":"2026-11-26","number":2,"start":"10:40","end":"12:10","subject":"Сельскохозяйственная экология","type":"Лек","room":"4516"},{"date":"2026-11-26","number":3,"start":"12:20","end":"13:50","subject":"История России","type":"Пр","room":"3212"},{"date":"2026-11-26","number":4,"start":"14:30","end":"16:05","subject":"Математика","type":"Пр","room":"4504"},{"date":"2026-11-27","number":3,"start":"12:20","end":"13:50","subject":"Физика","type":"Пр","room":"4519"},{"date":"2026-11-27","number":4,"start":"14:30","end":"16:05","subject":"Основы российской государственности","type":"Пр","room":"4519"},{"date":"2026-11-27","number":5,"start":"16:15","end":"17:50","subject":"Культура речи и деловые коммуникации","type":"Пр","room":"4513"}]}]},"ЛА-112":{"title":"Ландшафтная архитектура","weeks":[{"start":"2026-11-23","end":"2026-11-28","source_url":"reference-pdf-2026-11-23","lessons":[{"date":"2026-11-23","number":2,"start":"10:40","end":"12:10","subject":"История России","type":"Пр","room":"4516"},{"date":"2026-11-23","number":3,"start":"12:20","end":"13:50","subject":"Основы российской государственности","type":"Лек","room":"1402"},{"date":"2026-11-23","number":4,"start":"14:30","end":"16:05","subject":"Культура речи и деловые коммуникации","type":"Лек","room":"1402"},{"date":"2026-11-23","number":5,"start":"16:15","end":"17:50","subject":"История России","type":"Лек","room":"1402"},{"date":"2026-11-24","number":3,"start":"12:20","end":"13:50","subject":"Физика","type":"Пр","room":"4516"},{"date":"2026-11-24","number":4,"start":"14:30","end":"16:05","subject":"История России","type":"Лек","room":"1402"},{"date":"2026-11-24","number":5,"start":"16:15","end":"17:50","subject":"История России","type":"Лек","room":"1402"},{"date":"2026-11-25","number":1,"start":"09:00","end":"10:30","subject":"Иностранный язык","type":"Пр","room":"1401"},{"date":"2026-11-25","number":2,"start":"10:40","end":"12:10","subject":"Математика","type":"Пр","room":"4517"},{"date":"2026-11-25","number":3,"start":"12:20","end":"13:50","subject":"Физическая культура и спорт","type":"Пр","room":"4237"},{"date":"2026-11-25","number":4,"start":"14:30","end":"16:05","subject":"Культура речи и деловые коммуникации","type":"Пр","room":"4522"},{"date":"2026-11-25","number":5,"start":"16:15","end":"17:50","subject":"Иностранный язык","type":"Пр","room":"1401"},{"date":"2026-11-26","number":1,"start":"09:00","end":"10:30","subject":"Сельскохозяйственная экология","type":"Пр","room":"4516"},{"date":"2026-11-26","number":2,"start":"10:40","end":"12:10","subject":"Сельскохозяйственная экология","type":"Лек","room":"4516"},{"date":"2026-11-26","number":3,"start":"12:20","end":"13:50","subject":"История России","type":"Пр","room":"3212"},{"date":"2026-11-26","number":4,"start":"14:30","end":"16:05","subject":"Математика","type":"Пр","room":"4504"},{"date":"2026-11-27","number":4,"start":"14:30","end":"16:05","subject":"Физика","type":"Пр","room":"1406"},{"date":"2026-11-27","number":5,"start":"16:15","end":"17:50","subject":"Основы российской государственности","type":"Пр","room":"1105"}]}]},"С-111":{"title":"Садоводство","weeks":[{"start":"2026-11-23","end":"2026-11-28","source_url":"reference-pdf-2026-11-23","lessons":[{"date":"2026-11-23","number":3,"start":"12:20","end":"13:50","subject":"Основы российской государственности","type":"Лек","room":"1402"},{"date":"2026-11-23","number":4,"start":"14:30","end":"16:05","subject":"Культура речи и деловые коммуникации","type":"Лек","room":"1402"},{"date":"2026-11-23","number":5,"start":"16:15","end":"17:50","subject":"История России","type":"Лек","room":"1402"},{"date":"2026-11-23","number":6,"start":"18:00","end":"19:35","subject":"Культура речи и деловые коммуникации","type":"Пр","room":"4508"},{"date":"2026-11-24","number":4,"start":"14:30","end":"16:05","subject":"История России","type":"Лек","room":"1402"},{"date":"2026-11-24","number":5,"start":"16:15","end":"17:50","subject":"История России","type":"Лек","room":"1402"},{"date":"2026-11-25","number":4,"start":"14:30","end":"16:05","subject":"Математика","type":"Пр","room":"4517"},{"date":"2026-11-25","number":5,"start":"16:15","end":"17:50","subject":"Физика","type":"Пр","room":"4522"},{"date":"2026-11-25","number":6,"start":"18:00","end":"19:35","subject":"Иностранный язык","type":"Пр","room":"1401"},{"date":"2026-11-26","number":2,"start":"10:40","end":"12:10","subject":"Сельскохозяйственная экология","type":"Лек","room":"4516"},{"date":"2026-11-26","number":3,"start":"12:20","end":"13:50","subject":"Основы российской государственности","type":"Пр","room":"2106"},{"date":"2026-11-26","number":4,"start":"14:30","end":"16:05","subject":"Сельскохозяйственная экология","type":"Гк","room":"4316"},{"date":"2026-11-26","number":5,"start":"16:15","end":"17:50","subject":"История России","type":"Пр","room":"4314"},{"date":"2026-11-26","number":6,"start":"18:00","end":"19:35","subject":"История России","type":"Пр","room":"3202"},{"date":"2026-11-27","number":1,"start":"09:00","end":"10:30","subject":"Математика","type":"Пр","room":"1110"},{"date":"2026-11-27","number":2,"start":"10:40","end":"12:10","subject":"Физика","type":"Пр","room":"4519"},{"date":"2026-11-27","number":3,"start":"12:20","end":"13:50","subject":"Физическая культура и спорт","type":"Пр","room":"4237"},{"date":"2026-11-27","number":4,"start":"14:30","end":"16:05","subject":"Иностранный язык","type":"Пр","room":"3208"},{"date":"2026-11-27","number":5,"start":"16:15","end":"17:50","subject":"Физика","type":"Пр","room":"1406"}]}]}}};

function selectedGroup() {
  try {
    const saved = JSON.parse(fm.readString(GROUP_CHOICE_FILE));
    if (saved && GROUPS.some(group => group.id === saved.group)) return saved.group;
  } catch (_) {}
  return 'ЗиК-111';
}

function saveSelectedGroup(group) {
  if (!GROUPS.some(item => item.id === group)) throw new Error('Неизвестная группа');
  fm.writeString(GROUP_CHOICE_FILE, JSON.stringify({group}));
}

function validateGroupCollection(value) {
  if (!value || value.schema_version !== 2 || !value.groups || typeof value.groups !== 'object') return false;
  return GROUPS.every(group => {
    const item = value.groups[group.id];
    if (!item || !Array.isArray(item.weeks)) return false;
    return item.weeks.every(week =>
      /^\d{4}-\d{2}-\d{2}$/.test(week.start || '') &&
      /^\d{4}-\d{2}-\d{2}$/.test(week.end || '') &&
      Array.isArray(week.lessons) &&
      week.lessons.every(lesson =>
        /^\d{4}-\d{2}-\d{2}$/.test(lesson.date || '') &&
        /^\d{1,2}:\d{2}$/.test(lesson.start || '') &&
        /^\d{1,2}:\d{2}$/.test(lesson.end || '') &&
        typeof lesson.subject === 'string' && lesson.subject.length > 0
      )
    );
  });
}

function readGroupCache() {
  try {
    const stored = JSON.parse(fm.readString(GROUP_CACHE_FILE));
    if (stored && validateGroupCollection(stored.data)) return stored;
  } catch (_) {}
  return null;
}

async function groupCollection(force = false) {
  const cached = readGroupCache();
  const nowMs = Date.now();
  if (!force && cached && cached.url === STAGING_GROUPS_URL && nowMs - (cached.checkedAt || 0) < UPDATE_MS) return cached.data;
  try {
    const req = new Request(STAGING_GROUPS_URL + '?v=' + nowMs);
    req.timeoutInterval = 18;
    const result = await req.loadJSON();
    if (!validateGroupCollection(result)) throw new Error('Неверный формат данных групп');
    fm.writeString(GROUP_CACHE_FILE, JSON.stringify({url:STAGING_GROUPS_URL, checkedAt:nowMs, data:result}));
    return result;
  } catch (e) {
    if (force) throw e;
    if (cached) return cached.data;
    return EMBEDDED_GROUPS;
  }
}

function selectedTimetable(collection) {
  const group = selectedGroup();
  const entry = collection.groups[group];
  return {schema_version:1, group, timezone:'Asia/Yekaterinburg', weeks: entry ? entry.weeks : []};
}

const DEFAULT_SCHEDULE_URL = "https://raw.githubusercontent.com/HorusOwlvision/zik111-timetable/main/data/schedule.json";

function getScheduleUrl() {
  try {
    if (fm.fileExists(configPath)) {
      const saved = JSON.parse(fm.readString(configPath));
      if (saved && typeof saved.url === "string" && saved.url.startsWith("https://raw.githubusercontent.com/")) {
        return saved.url;
      }
    }
  } catch (_) {}
  return DEFAULT_SCHEDULE_URL;
}

function readCache() {
  try {
    if (fm.fileExists(cachePath)) return JSON.parse(fm.readString(cachePath));
  } catch (_) {}
  return null;
}

async function downloadSchedule(url, nonce) {
  const req = new Request(url + (url.includes("?") ? "&" : "?") + "v=" + nonce);
  req.timeoutInterval = 18;
  const data = await req.loadJSON();
  if (!validData(data)) throw new Error("Сервер вернул пустое или некорректное расписание");
  return data;
}

function saveCache(url, data) {
  fm.writeString(cachePath, JSON.stringify({url, checkedAt: Date.now(), data}));
}

function ekbDate(day, hhmm) {
  const [y,m,d] = day.split("-").map(Number);
  const [hh,mm] = hhmm.split(":").map(Number);
  return new Date(Date.UTC(y,m-1,d,hh-TIMEZONE_HOURS,mm));
}

function validData(x) {
  if (!x || x.schema_version !== 1 || x.group !== "ЗиК-111" || !Array.isArray(x.weeks) || x.weeks.length === 0) return false;
  return x.weeks.every(w => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(w.start || "") || !/^\d{4}-\d{2}-\d{2}$/.test(w.end || "") || !Array.isArray(w.lessons) || w.lessons.length === 0) return false;
    return w.lessons.every(l => /^\d{4}-\d{2}-\d{2}$/.test(l.date || "") && /^\d{1,2}:\d{2}$/.test(l.start || "") && /^\d{1,2}:\d{2}$/.test(l.end || "") && typeof l.subject === "string" && l.subject.length > 0);
  });
}

async function scheduleData() {
  const collection = await groupCollection(false);
  return selectedTimetable(collection);
}

function nextDate(iso) {
  const [y,m,d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y,m-1,d+1,-TIMEZONE_HOURS,0));
}

function flattenLessons(timetable) {
  const periods = timetable.weeks || [];
  const lessons = periods.flatMap(w => w.lessons.map(l => ({
    day: l.date, number: l.number, begin: l.start, finish: l.end,
    subject: l.subject, type: l.type || "Пр", room: l.room || "—",
    start: ekbDate(l.date, l.start), end: ekbDate(l.date, l.end)
  }))).sort((a,b) => a.start - b.start);
  return {periods, lessons};
}

function currentStatus(periods, lessons, now) {
  if (!periods.length) return {kind:"expired"};
  const first = periods.map(w=>w.start).sort()[0];
  const last = periods.map(w=>w.end).sort().slice(-1)[0];
  if (now < ekbDate(first, "00:00")) return {kind:"notYet"};
  if (now >= nextDate(last)) return {kind:"expired"};
  for (const lesson of lessons) {
    if (now >= lesson.start && now < lesson.end) return {kind:"ongoing", lesson, target: lesson.end};
    if (now < lesson.start) return {kind:"upcoming", lesson, target: lesson.start};
  }
  return {kind:"finished"};
}

function shortSubject(name) {
  if (name === "Основы российской государственности") return "Основы государственности";
  if (name === "Культура речи и деловые коммуникации") return "Культура речи";
  if (name === "Физическая культура и спорт") return "Физкультура";
  return name;
}

function dayShort(dateStr) {
  const map = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];
  const [year, month, day] = dateStr.split("-").map(Number);
  return map[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
}

function fmtRange(periods) {
  if (!periods.length) return "НЕТ ДАННЫХ";
  const s = periods[periods.length - 1].start;
  const e = periods[periods.length - 1].end;
  return s.slice(8,10) + "." + s.slice(5,7) + " — " + e.slice(8,10) + "." + e.slice(5,7);
}

const ALBUM_IMAGE_BASE64 = "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";
const WHITE = "#FFFFFF";
const SOFT_WHITE = "#C9E8FF";
const albumImg = Image.fromData(Data.fromBase64String(ALBUM_IMAGE_BASE64));

function label(host, value, size, weight = "regular", color = WHITE, limit = 1, scale = 0.65) {
  const el = host.addText(String(value));
  el.font = weight === "heavy" ? Font.heavySystemFont(size) : weight === "bold" ? Font.boldSystemFont(size) : weight === "semibold" ? Font.semiboldSystemFont(size) : Font.systemFont(size);
  el.textColor = new Color(color);
  el.lineLimit = limit;
  el.minimumScaleFactor = scale;
  return el;
}

function blueBackground(w) {
  const gradient = new LinearGradient();
  gradient.locations = [0, 0.53, 1];
  gradient.colors = [new Color("#1CA8FF"), new Color("#087FFA"), new Color("#006DE8")];
  w.backgroundGradient = gradient;
}

function album(host, size) {
  const im = host.addImage(albumImg);
  im.imageSize = new Size(size, size);
  return im;
}

function liveTimer(host, date, size) {
  const t = host.addDate(date);
  t.applyTimerStyle();
  t.font = Font.boldMonospacedSystemFont(size);
  t.textColor = new Color(WHITE);
  t.lineLimit = 1;
  t.minimumScaleFactor = 0.58;
  return t;
}

function compactSubject(s) {
  if (s === "Основы российской государственности") return "Основы гос-ва";
  if (s === "Культура речи и деловые коммуникации") return "Культура речи";
  if (s === "Физическая культура и спорт") return "Физкультура";
  return s;
}

function classType(t) {
  if (t === "Лек") return "Лекция";
  if (t === "Лаб") return "Лабораторная";
  if (t === "ГК") return "Групп. консультация";
  return "Практика";
}

function icon(host, pts) {
  const shell = host.addStack();
  shell.backgroundColor = new Color("#FFFFFF",0.19);
  shell.cornerRadius = 8;
  shell.setPadding(4,4,4,4);
  const sf = SFSymbol.named("calendar");
  const img = shell.addImage(sf.image);
  img.imageSize = new Size(pts,pts);
  img.tintColor = new Color(WHITE);
}

function status(state) {
  if (state.kind === "ongoing") return "ДО КОНЦА";
  if (state.kind === "upcoming") return "ДО НАЧАЛА";
  return "РАСПИСАНИЕ";
}

function smallWidget(state, periods, now) {
  const w = new ListWidget();
  blueBackground(w);
  w.setPadding(11,12,10,12);
  w.spacing = 0;
  const active = state.kind === "upcoming" || state.kind === "ongoing";

  const top = w.addStack();
  top.layoutHorizontally();
  top.centerAlignContent();
  album(top, 49);
  top.addSpacer();
  const right = top.addStack();
  right.layoutVertically();
  const icoRow = right.addStack();
  icoRow.addSpacer();
  icon(icoRow, 16);
  right.addSpacer(4);
  const caption = label(right, status(state), 8.8, "bold", "#FFFFFF", 1, 0.64);
  caption.rightAlignText();
  if (active) {
    const day = label(right, dayShort(state.lesson.day), 9, "semibold", SOFT_WHITE);
    day.rightAlignText();
  }

  w.addSpacer(6);
  if (active) {
    const lesson = state.lesson;
    liveTimer(w, state.target, 25);
    w.addSpacer(4);
    const title = label(w, compactSubject(lesson.subject), 14.5, "heavy", WHITE, 1, 0.58);
    w.addSpacer(5);
    label(w, "№" + lesson.number + " · " + lesson.begin + "–" + lesson.finish, 10.5, "semibold", "#E4F4FF");
    w.addSpacer(3);
    label(w, classType(lesson.type) + " · ауд. " + lesson.room, 10.5, "semibold", SOFT_WHITE, 1, 0.60);
    w.refreshAfterDate = new Date(Math.max(now.getTime()+60000, state.target.getTime()+1000));
  } else {
    w.addSpacer(2);
    label(w, state.kind === "expired" ? "НЕТ ДАННЫХ" : state.kind === "notYet" ? "СКОРО ПАРЫ" : "ПАРЫ ОКОНЧЕНЫ", 15, "heavy", WHITE, 2);
    w.addSpacer(5);
    label(w, state.kind === "expired" ? "Ждём новый PDF" : state.kind === "notYet" ? "Неделя впереди" : "На этой неделе всё", 11, "semibold", SOFT_WHITE);
    w.refreshAfterDate = new Date(now.getTime()+1800000);
  }
  return w;
}

function mediumWidget(state, periods, now) {
  const w = new ListWidget();
  blueBackground(w);
  w.setPadding(15,16,14,16);
  w.spacing = 0;
  const active = state.kind === "upcoming" || state.kind === "ongoing";
  const content = w.addStack();
  content.layoutHorizontally();
  content.centerAlignContent();
  album(content, 115);
  content.addSpacer(15);

  const info = content.addStack();
  info.layoutVertically();
  const top = info.addStack();
  top.layoutHorizontally();
  top.centerAlignContent();
  label(top, "●  " + status(state) + (active ? " · " + dayShort(state.lesson.day) : ""), 10.3, "bold", WHITE, 1, 0.6);
  top.addSpacer();
  icon(top, 14);
  info.addSpacer(6);

  if (active) {
    const lesson = state.lesson;
    liveTimer(info, state.target, 27);
    info.addSpacer(6);
    const subject = label(info, shortSubject(lesson.subject), 17, "heavy", WHITE, 1, 0.6);
    info.addSpacer(5);
    label(info, "№" + lesson.number + " · " + lesson.begin + "–" + lesson.finish, 11.3, "semibold", "#E8F5FF", 1, 0.61);
    info.addSpacer(4);
    label(info, classType(lesson.type) + " · ауд. " + lesson.room, 11.3, "semibold", SOFT_WHITE, 1, 0.59);
    w.refreshAfterDate = new Date(Math.max(now.getTime()+60000, state.target.getTime()+1000));
  } else {
    info.addSpacer(7);
    label(info, state.kind === "expired" ? "НЕТ РАСПИСАНИЯ" : state.kind === "notYet" ? "СКОРО ПАРЫ" : "ПАРЫ ОКОНЧЕНЫ", 19, "heavy", WHITE, 2);
    info.addSpacer(6);
    label(info, state.kind === "expired" ? "Ожидаем обновление" : state.kind === "notYet" ? "Учёба скоро начнётся" : "На этой неделе всё", 12.2, "semibold", SOFT_WHITE, 2);
    w.refreshAfterDate = new Date(now.getTime()+1800000);
  }
  return w;
}

function purpleText(host, value, pt, fg, weight = "regular", limit = 1) {
  const t = host.addText(value);
  t.font = weight === "bold" ? Font.boldSystemFont(pt) :
           weight === "semibold" ? Font.semiboldSystemFont(pt) : Font.systemFont(pt);
  t.textColor = new Color(fg);
  t.lineLimit = limit;
  t.minimumScaleFactor = 0.62;
  return t;
}
function purpleCenteredText(host, value, pt, fg, weight = "regular", limit = 1) {
  const row = host.addStack();
  row.layoutHorizontally();
  row.centerAlignContent();
  row.addSpacer();
  const t = purpleText(row, value, pt, fg, weight, limit);
  t.centerAlignText();
  row.addSpacer();
  return t;
}
function purpleBadge(host, value, accent, bg, medium = false) {
  const row = host.addStack();
  row.layoutHorizontally();
  row.centerAlignContent();
  row.addSpacer();
  const pill = row.addStack();
  pill.backgroundColor = new Color(bg);
  pill.cornerRadius = medium ? 14 : 10;
  pill.setPadding(medium ? 5 : 4, medium ? 13 : 10, medium ? 5 : 4, medium ? 13 : 10);
  const t = purpleText(pill, value, medium ? 12 : 9.5, accent, "bold");
  t.centerAlignText();
  row.addSpacer();
}
function purpleTimer(host, target, medium=false) {
  const row = host.addStack();
  row.layoutHorizontally();
  row.centerAlignContent();
  row.addSpacer();
  const timer = row.addDate(target);
  timer.applyTimerStyle();
  timer.font = Font.boldMonospacedSystemFont(medium ? 36 : 30);
  timer.textColor = new Color("#FFFFFF");
  timer.lineLimit = 1;
  timer.minimumScaleFactor = 0.57;
  timer.centerAlignText();
  row.addSpacer();
}
function purpleWidget(state, periods, now, medium=false) {
  const w = new ListWidget();
  w.spacing = 0;
  w.setPadding(medium ? 13 : 10, medium ? 16 : 10, medium ? 13 : 10, medium ? 16 : 10);
  const bg = new LinearGradient();
  bg.locations = [0, 0.52, 1];
  bg.colors = [new Color("#0A1221"), new Color("#191638"), new Color("#2B164B")];
  w.backgroundGradient = bg;
  w.addSpacer();
  const active = state.kind === 'ongoing' || state.kind === 'upcoming';
  const accent = state.kind === 'ongoing' ? '#76FFE0' : '#D2ABFF';
  const dark = state.kind === 'ongoing' ? '#1A3F3C' : '#34244E';
  if (active) {
    const l = state.lesson;
    purpleBadge(w, (state.kind === 'ongoing' ? '●  ДО КОНЦА' : '●  ДО НАЧАЛА') + '  ·  ' + dayShort(l.day), accent, dark, medium);
    w.addSpacer(medium ? 7 : 5);
    purpleTimer(w, state.target, medium);
    w.addSpacer(medium ? 10 : 9);
    const name = purpleCenteredText(w, shortSubject(l.subject), medium ? 21 : 17, '#FFFFFF', 'bold', 2);
    name.minimumScaleFactor = 0.63;
    w.addSpacer(medium ? 8 : 8);
    purpleCenteredText(w, '№' + l.number + '   ·   ' + l.begin + '–' + l.finish,
                       medium ? 12.5 : 10.8, '#D9D3EA', 'semibold');
    w.addSpacer(medium ? 5 : 4);
    purpleCenteredText(w, (l.type === 'Лек' ? 'ЛЕКЦИЯ' : l.type === 'Лаб' ? 'ЛАБ.' : 'ПРАКТИКА') + '   ·   АУД. ' + l.room,
                       medium ? 12 : 10.5, accent, 'bold');
    w.refreshAfterDate = new Date(Math.max(now.getTime() + 60000, state.target.getTime() + 1000));
  } else {
    const expired = state.kind === 'expired';
    purpleBadge(w, expired ? '●  НУЖНО ОБНОВИТЬ' : '●  ЗАНЯТИЙ НЕТ', accent, dark, medium);
    w.addSpacer(10);
    purpleCenteredText(w, expired ? 'НЕТ РАСПИСАНИЯ' : state.kind === 'notYet' ? 'СКОРО НАЧАЛО' : 'ПАРЫ ОКОНЧЕНЫ',
                       medium ? 22 : 18, '#FFFFFF', 'bold', 2);
    w.addSpacer(9);
    purpleCenteredText(w, expired ? 'Проверка с сайта' : state.kind === 'notYet' ? 'Смотри расписание' : 'На сегодня всё',
                       medium ? 14 : 12, '#D9D3EA', 'semibold', 2);
    w.addSpacer(7);
    purpleCenteredText(w, fmtRange(periods), medium ? 12 : 10, '#A9A2C6', 'bold');
    w.refreshAfterDate = new Date(now.getTime() + 30*60000);
  }
  w.addSpacer();
  return w;
}

const STAGING_SKIN_FILE = fm.joinPath(fm.documentsDirectory(), 'zik111_staging_skin_v1.json');
const THEMES = [
  {id:'default',name:'💜 Original Purple'},
  {id:'vk',name:'💙 VK Blue'},
  {id:'chrome',name:'01 · CHROME',c1:'#080B11',c2:'#1B2231',fg:'#FFFFFF',muted:'#AFBDD0',accent:'#CEDBEA',mark:'#7A8B9D',pattern:'chrome',layout:'left'},
  {id:'noir',name:'02 · OLED NOIR',c1:'#050607',c2:'#010101',fg:'#FAFAFA',muted:'#989898',accent:'#BFFF4D',mark:'#47691B',pattern:'noir',layout:'center'},
  {id:'glacier',name:'03 · GLACIER',c1:'#F0FBFF',c2:'#B8D9F4',fg:'#15304C',muted:'#4B6A87',accent:'#2F75CE',mark:'#86BDEB',pattern:'glacier',layout:'split'},
  {id:'carbon',name:'04 · CARBON',c1:'#161719',c2:'#28282B',fg:'#FFFFFF',muted:'#B9B7B7',accent:'#FF5A60',mark:'#5C2024',pattern:'carbon',layout:'left'},
  {id:'aurora',name:'05 · AURORA',c1:'#081928',c2:'#0B524C',fg:'#F2FFFD',muted:'#A8D7D2',accent:'#8BFFDF',mark:'#207E77',pattern:'aurora',layout:'center'},
  {id:'sunset',name:'06 · SUNSET',c1:'#3A1F5F',c2:'#C85A6D',fg:'#FFF8F3',muted:'#FFE3E6',accent:'#FFD38E',mark:'#AC4264',pattern:'sunset',layout:'split'},
  {id:'atelier',name:'07 · ATELIER',c1:'#F7F3EA',c2:'#E8E1D2',fg:'#22211E',muted:'#79766E',accent:'#AD8152',mark:'#D8C9AE',pattern:'atelier',layout:'left'},
  {id:'blueprint',name:'08 · BLUEPRINT',c1:'#09295C',c2:'#0D4885',fg:'#FFFFFF',muted:'#B6D5FC',accent:'#83E8FF',mark:'#316CA2',pattern:'blueprint',layout:'split'},
  {id:'rose',name:'09 · ROSE QUARTZ',c1:'#FFE7EE',c2:'#EFB7CF',fg:'#56263E',muted:'#8A5F73',accent:'#C54588',mark:'#E6A1C2',pattern:'rose',layout:'center'},
  {id:'forest',name:'10 · FOREST GOLD',c1:'#0B2B26',c2:'#164F3C',fg:'#FFFDF1',muted:'#B9D0BE',accent:'#E8CC8E',mark:'#327760',pattern:'forest',layout:'left'}
];

function getSkin() {
  try {
    if (fm.fileExists(STAGING_SKIN_FILE)) {
      const data = JSON.parse(fm.readString(STAGING_SKIN_FILE));
      if (THEMES.some(t => t.id === data.skin)) return data.skin;
    }
  } catch (_) {}
  return 'default';
}
function setSkin(id) {
  if (!THEMES.some(t => t.id === id)) throw new Error('Unknown staging skin');
  fm.writeString(STAGING_SKIN_FILE,JSON.stringify({skin:id,updatedAt:new Date().toISOString()}));
}
function getTheme(id) { return THEMES.find(t => t.id===id) || THEMES[0]; }

function hexRGB(hex) {
  return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
}
function blend(hex1,hex2,t) {
  const a=hexRGB(hex1),b=hexRGB(hex2);
  const x=a.map((v,i)=>Math.max(0,Math.min(255,Math.round(v+(b[i]-v)*t))).toString(16).padStart(2,'0'));
  return '#'+x.join('');
}
function artwork(theme, medium) {
  const width=medium?640:320, height=320;
  const dc=new DrawContext();
  dc.size=new Size(width,height);
  dc.opaque=true;
  dc.respectScreenScale=false;
  
  for (let y=0;y<height;y+=4) {
    dc.setFillColor(new Color(blend(theme.c1,theme.c2,y/height)));
    dc.fillRect(new Rect(0,y,width,5));
  }
  const line=(x1,y1,x2,y2,col,opacity=1,w=1)=>{
    dc.setStrokeColor(new Color(col,opacity));dc.setLineWidth(w);
    const path = new Path();
    path.move(new Point(x1,y1));
    path.addLine(new Point(x2,y2));
    dc.addPath(path);
    dc.strokePath();
  };
  const dot=(x,y,r,col,alpha=1)=>{dc.setFillColor(new Color(col,alpha));dc.fillEllipse(new Rect(x-r,y-r,r*2,r*2));};
  if(theme.pattern==='chrome') {
    for(let i=0;i<15;i++) line(width-160+i*23,-28,width-75+i*23,115,theme.accent,i%3===0?.22:.09,i%3===0?3:1);
    for(let i=0;i<6;i++) line(18+i*7,275,60+i*7,310,theme.accent,.22,2);
    line(18,20,105,20,theme.accent,.5,2);line(width-72,299,width-17,299,theme.accent,.4,2);
  } else if(theme.pattern==='noir') {
    dot(width-31,36,5,theme.accent,.85);
    for(let r=110;r>=30;r-=18) dot(width-34,40,r,theme.accent,.012);
  } else if(theme.pattern==='glacier') {
    for(let i=0;i<13;i++) line(width-120+i*16,0,width-280+i*16,320,theme.accent,.11,2);
    for(let i=0;i<8;i++) dot(width*(.2+.13*(i%5)),50+33*i,5+i%3*5,theme.mark,.17);
  } else if(theme.pattern==='carbon') {
    for(let i=-height;i<width+height;i+=24) line(i,0,i+height,height,theme.mark,.20,3);
    for(let i=0;i<width;i+=28) line(i,0,i,320,theme.mark,.08,1);
    line(0,0,width,0,theme.accent,.65,8);
  } else if(theme.pattern==='aurora') {
    for(let r=130;r>=20;r-=13) dot(width-34,16,r,theme.accent,.008+(130-r)*.00010);
    for(let i=0;i<7;i++) line(0,100+i*18,width,50+i*35,theme.accent,.08,2);
  } else if(theme.pattern==='sunset') {
    for(let r=150;r>10;r-=10) dot(width-28,40,r,theme.accent,.025);
    for(let y=246;y<320;y+=12) line(0,y,width,y,theme.accent,.15,2);
  } else if(theme.pattern==='atelier') {
    dot(width-38,275,26,theme.accent,.14);
    for(let i=0;i<5;i++) line(width-100+i*10,45,width-100+i*10,75,theme.accent,.13,1);
  } else if(theme.pattern==='blueprint') {
    for(let x=0;x<width;x+=24) line(x,0,x,height,theme.accent,.11,1);
    for(let y=0;y<height;y+=24) line(0,y,width,y,theme.accent,.11,1);
    for(let r=38;r<190;r+=25) {
      dc.setStrokeColor(new Color(theme.accent,.09)); dc.setLineWidth(1);
      dc.strokeEllipse(new Rect(width-120-r/2,40-r/2,r,r));
    }
  } else if(theme.pattern==='rose') {
    for(let r=180;r>=30;r-=20) dot(width+10,0,r,theme.accent,.014);
    for(let i=0;i<7;i++) line(-20+i*30,320,130+i*30,155,theme.accent,.11,2);
  } else if(theme.pattern==='forest') {
    for(let r=170;r>=30;r-=16) dot(width-18,24,r,theme.accent,.012);
    for(let r=100;r>=20;r-=14) dot(58,height-46,r,theme.mark,.020);
    for(let i=0;i<6;i++) dot(42+i*28,height-34-(i%2)*6,3+(i%3),theme.accent,.22);
    for(let i=0;i<5;i++) line(width-180+i*28,50+i*10,width-75+i*12,140+i*8,theme.mark,.08,2);
    line(24,height-24,132,height-24,theme.accent,.18,2);
  }
  return dc.getImage();
}
function uiText(host,txt,sz,color,bold=false,limit=1) {
  const t=host.addText(String(txt));
  t.font=bold?Font.boldSystemFont(sz):Font.mediumSystemFont(sz);
  t.textColor=new Color(color);
  t.lineLimit=limit;
  t.minimumScaleFactor=.55;
  return t;
}
function uiRow(w,align) {
  const row=w.addStack(); row.layoutHorizontally(); row.centerAlignContent();
  if(align==='center') row.addSpacer();
  return row;
}
function uiEnd(row,align) {if(align==='center')row.addSpacer();}
function uiTimer(w,target,sz,color,align) {
  const row=uiRow(w,align);
  const t=row.addDate(target);t.applyTimerStyle();
  t.font=Font.boldMonospacedSystemFont(sz);
  t.textColor=new Color(color);t.lineLimit=1;t.minimumScaleFactor=.55;
  if(align==='center')t.centerAlignText();
  uiEnd(row,align);
}
function uiTitle(w,label,sz,col,align) {
  const row=uiRow(w,align);const t=uiText(row,label,sz,col,true,2);
  if(align==='center')t.centerAlignText();
  uiEnd(row,align);
}
function uiLabel(w,label,sz,col,align) {
  const row=uiRow(w,align);const t=uiText(row,label,sz,col,false,1);
  if(align==='center')t.centerAlignText();
  uiEnd(row,align);
}
function uiRule(w,accent,align) {
  const row=uiRow(w,align);
  const rule=row.addStack();rule.size=new Size(34,2);
  rule.backgroundColor=new Color(accent);
  uiEnd(row,align);
}
function uiBadge(w,label,theme,align,medium) {
  const row=uiRow(w,align);
  const badge=row.addStack();badge.layoutHorizontally();badge.centerAlignContent();
  badge.backgroundColor=new Color(theme.accent,.13);
  badge.cornerRadius=7;badge.setPadding(3,medium?10:7,3,medium?10:7);
  const t=uiText(badge,label,medium?10:9,theme.accent,true);
  t.minimumScaleFactor=.62;
  uiEnd(row,align);
}
function modernWidget(theme,state,periods,now,medium) {
  const w=new ListWidget();w.spacing=0;
  const align=theme.layout==='center'?'center':'left';
  const sides=medium?17:13, top=medium?12:13;
  w.setPadding(top,sides,top,sides);
  w.backgroundImage=artwork(theme,medium);
  const active=state.kind==='ongoing'||state.kind==='upcoming';
  const caption=active?(state.kind==='ongoing'?'ДО КОНЦА':'ДО НАЧАЛА')+' · '+dayShort(state.lesson.day):'РАСПИСАНИЕ';
  w.addSpacer();
  uiBadge(w,caption,theme,align,medium);
  w.addSpacer(medium?5:7);
  if(active) {
    const l=state.lesson;
    if(theme.layout==='split'&&medium) {
      const h=w.addStack();h.layoutHorizontally();h.centerAlignContent();
      const t=h.addDate(state.target);t.applyTimerStyle();t.font=Font.boldMonospacedSystemFont(35);
      t.textColor=new Color(theme.fg);t.lineLimit=1;t.minimumScaleFactor=.6;
      h.addSpacer();
      uiText(h,'№'+l.number,16,theme.accent,true);
    } else {
      uiTimer(w,state.target,medium?36:29,theme.fg,align);
    }
    w.addSpacer(medium?7:5);
    if(theme.layout!=='center') {uiRule(w,theme.accent,align); w.addSpacer(medium?8:6);}
    uiTitle(w,shortSubject(l.subject),medium?19.5:16.5,theme.fg,align);
    w.addSpacer(medium?5:4);
    uiLabel(w,'№'+l.number+' · '+l.begin+'–'+l.finish,medium?11.5:10,theme.muted,align);
    w.addSpacer(3);
    uiLabel(w,(l.type==='Лек'?'ЛЕКЦИЯ':l.type==='Лаб'?'ЛАБ.':'ПРАКТИКА')+' · АУД. '+l.room,medium?11:9.5,theme.accent,align);
    w.refreshAfterDate=new Date(Math.max(now.getTime()+60000,state.target.getTime()+1000));
  } else {
    w.addSpacer(9);
    const msg=state.kind==='expired'?'НЕТ РАСПИСАНИЯ':state.kind==='notYet'?'СКОРО НАЧАЛО':'ПАРЫ ЗАКОНЧИЛИСЬ';
    uiTitle(w,msg,medium?23:19,theme.fg,align);
    w.addSpacer(8);
    uiRule(w,theme.accent,align);
    w.addSpacer(8);
    uiLabel(w,state.kind==='expired'?'Ожидаем публикацию':state.kind==='notYet'?'Начало недели впереди':'На сегодня всё',medium?13:11,theme.muted,align);
    w.addSpacer(5);
    uiLabel(w,fmtRange(periods),medium?11:10,theme.accent,align);
    w.refreshAfterDate=new Date(now.getTime()+30*60000);
  }
  w.addSpacer();
  return w;
}

function lockText(host, value, size, color, bold = false) {
  const t = host.addText(value);
  t.font = bold ? Font.boldSystemFont(size) : Font.semiboldSystemFont(size);
  t.textColor = new Color(color);
  t.lineLimit = 1;
  t.minimumScaleFactor = 0.68;
  return t;
}
function lockCenteredText(host, value, size, color, bold = false) {
  const row = host.addStack();
  row.layoutHorizontally();
  row.centerAlignContent();
  row.addSpacer();
  const t = lockText(row, value, size, color, bold);
  t.centerAlignText();
  row.addSpacer();
  return t;
}
function lockCompactName(name) {
  if (name === 'Основы российской государственности') return 'Государственность';
  if (name === 'Культура речи и деловые коммуникации') return 'Культура речи';
  if (name === 'Физическая культура и спорт') return 'Физкультура';
  return name;
}
function lockWidget(state, now) {
  const w = new ListWidget();
  w.addAccessoryWidgetBackground = false;
  w.backgroundColor = new Color('#000000', 0); 
  w.setPadding(2, 5, 2, 5);
  w.spacing = 0;
  w.addSpacer();

  const active = state.kind === 'ongoing' || state.kind === 'upcoming';
  const accent = state.kind === 'ongoing' ? '#84F0DA' : '#D3B5FF';

  if (active) {
    const lesson = state.lesson;
    const header = w.addStack();
    header.layoutHorizontally();
    header.centerAlignContent();
    const l = lockText(header, state.kind === 'ongoing' ? '● ДО КОНЦА' : '● ДО НАЧАЛА',
                       9, accent, true);
    l.minimumScaleFactor = 0.7;
    header.addSpacer(5);
    lockText(header, '№' + lesson.number + ' · ' + lesson.room, 9, '#F0E9FF', true);
    w.addSpacer(2);

    const timerRow = w.addStack();
    timerRow.layoutHorizontally();
    timerRow.centerAlignContent();
    timerRow.addSpacer();
    const timer = timerRow.addDate(state.target);
    timer.applyTimerStyle();
    timer.font = Font.boldMonospacedSystemFont(23);
    timer.textColor = new Color('#FFFFFF');
    timer.lineLimit = 1;
    timer.minimumScaleFactor = 0.6;
    timer.centerAlignText();
    timerRow.addSpacer();
    w.addSpacer(1);

    const subject = lockCompactName(lesson.subject);
    lockCenteredText(w, subject, subject.length > 18 ? 12 : 14, '#FFFFFF', true);
    w.refreshAfterDate = new Date(Math.max(now.getTime() + 60000, state.target.getTime() + 1000));
  } else {
    lockCenteredText(w, '● РАСПИСАНИЕ', 9.5, accent, true);
    w.addSpacer(4);
    const headline = state.kind === 'expired' ? 'НЕТ РАСПИСАНИЯ' :
                     state.kind === 'notYet' ? 'ПАРЫ СКОРО' : 'ПАРЫ ОКОНЧЕНЫ';
    lockCenteredText(w, headline, 15, '#FFFFFF', true);
    w.addSpacer(3);
    lockCenteredText(w, state.kind === 'expired' ? 'Ожидаем новый PDF' :
                         state.kind === 'notYet' ? 'Скоро начало' : 'На этой неделе всё',
                         10, '#F0E9FF');
    w.refreshAfterDate = new Date(now.getTime() + 30 * 60000);
  }
  w.addSpacer();
  return w;
}

function renderSkin(skin,family,state,periods,now) {
  if(family==='accessoryRectangular') return lockWidget(state,now);
  const medium=family==='medium';
  if(skin==='default') return purpleWidget(state,periods,now,medium);
  if(skin==='vk') return medium?mediumWidget(state,periods,now):smallWidget(state,periods,now);
  return modernWidget(getTheme(skin),state,periods,now,medium);
}
const STAGING_BUILD_VERSION = '1.0.8';

async function chooseGroup() {
  const current = selectedGroup();
  const alert = new Alert();
  alert.title = 'Выбор направления / группы';
  alert.message = 'Текущая группа: ' + current + '. Выбор сохраняется на устройстве.';
  for (const group of GROUPS) alert.addAction((group.id === current ? '✓ ' : '') + group.title + ' · ' + group.id);
  alert.addCancelAction('Назад');
  const selected = await alert.presentSheet();
  if (selected < 0 || selected >= GROUPS.length) return;
  const group = GROUPS[selected];
  saveSelectedGroup(group.id);
  const data = await scheduleData();
  const count = data.weeks.reduce((total, week) => total + week.lessons.length, 0);
  const summary = new Alert();
  summary.title = 'Группа выбрана: ' + group.id;
  summary.message = group.title + '\nЗанятий в загруженном расписании: ' + count + '\nВыбранная тема сохранена.';
  summary.addAction('Готово');
  await summary.presentAlert();
}

async function menu() {
  const current = getSkin();
  const main = new Alert();
  main.title = 'Расписание';
  main.message = 'Группа: ' + selectedGroup() + '\nТекущая тема: ' + getTheme(current).name;
  main.addAction('🎨 Выбрать тему');
  main.addAction('🎓 Выбрать направление / группу');
  main.addCancelAction('Закрыть');
  const choice = await main.presentSheet();
  if (choice === 0) {
    const picker = new Alert();
    picker.title = 'Выбор темы';
    picker.message = 'Выбранная тема будет применена к виджетам Small и Medium.';
    for (const theme of THEMES) picker.addAction((theme.id === current ? '✓ ' : '') + theme.name);
    picker.addCancelAction('Назад');
    const selection = await picker.presentSheet();
    if (selection >= 0 && selection < THEMES.length) {
      setSkin(THEMES[selection].id);
      const notification = new Alert();
      notification.title = 'Тема сохранена';
      notification.message = THEMES[selection].name;
      notification.addAction('Готово');
      await notification.presentAlert();
    }
  } else if (choice === 1) {
    await chooseGroup();
  }
}
if(config.runsInWidget) {
  const data=await scheduleData();
  const {periods,lessons}=flattenLessons(data);
  const now=new Date(),state=currentStatus(periods,lessons,now);
  const widget=renderSkin(getSkin(),config.widgetFamily||'small',state,periods,now);
  widget.url=URLScheme.forRunningScript();
  Script.setWidget(widget);
} else await menu();
Script.complete();
};
