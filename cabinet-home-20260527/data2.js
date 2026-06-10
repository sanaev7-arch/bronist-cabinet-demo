// Данные для B3. Брони хранятся в абсолютных днях (offset от 27.05.2026, день 0).
// Окно показывает 14 дней начиная с windowStart; стрелки двигают окно.

const WD = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const MONTHS = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const BASE = new Date(2026, 4, 27); // день 0 = сегодня

function genDays(windowStart) {
  return Array.from({ length: 14 }, (_, i) => {
    const off = windowStart + i;
    const d = new Date(BASE);
    d.setDate(BASE.getDate() + off);
    const dow = d.getDay();
    return { off, day: d.getDate(), month: d.getMonth(), wd: WD[dow], weekend: dow === 0 || dow === 6, today: off === 0 };
  });
}

// id/имена/поля согласованы с экраном «Объекты» (для деплинка и модалки «Информация по объекту»)
const OBJECTS = [
  { id:'tverskaya', name:'Тверская 15', sub:'Квартира · 54 м²', space:'Центр',   addr:'Москва, ул. Тверская, 15, кв. 48', type:'Квартира',   rooms:'2 комнаты', area:'54 м²', status:'pub' },
  { id:'arbat',     name:'Арбат 8',     sub:'Студия · 32 м²',   space:'Центр',   addr:'Москва, ул. Арбат, 8, кв. 12',     type:'Студия',     rooms:'студия',    area:'32 м²', status:'pub' },
  { id:'lenina',    name:'Ленина 42',   sub:'Апартаменты · 61 м²', space:'У метро', addr:'Москва, пр-т Ленина, 42, кв. 91', type:'Апартаменты', rooms:'2 комнаты', area:'61 м²', status:'pub' },
  { id:'pobedy',    name:'Победы 7',    sub:'Квартира · 38 м²', space:'У метро', addr:'Москва, ул. Победы, 7, кв. 5',     type:'Квартира',   rooms:'1 комната', area:'38 м²', status:'draft' },
  { id:'sadovaya',  name:'Садовая 3',   sub:'Квартира · 78 м²', space:'Центр',   addr:'Москва, ул. Садовая, 3, кв. 120',  type:'Квартира',   rooms:'3 комнаты', area:'78 м²', status:'pub' },
];

// status: 'confirmed' (подтверждена/оплачена) | 'prepay' (ждёт предоплату) | 'ota' (новая из OTA)
// code: 'loaded' (зелёный) | 'loading' (жёлтый) | 'notloaded' (красный) — статус кода замка; codeNum — сам код (виден по клику)
// доп. поля (phone/ch/guests/src/paid) — для полной карточки брони (как в Календаре)
const BOOKINGS = [
  { obj: 0, start: -4, end: -1, guest: 'Олег Тихонов', price: 22000, status: 'confirmed', code: 'loaded', codeNum: '4821#', phone: '+7 916 271-04-15', ch: 'tg',  guests: 2, src: 'Авито',    paid: 'оплачено' },
  { obj: 0, start: 0,  end: 3,  guest: 'Сергей Котов', price: 18400, status: 'confirmed', code: 'loaded', codeNum: '9500#', phone: '+7 916 200-11-22', ch: 'tg',  guests: 2, src: 'Авито',    paid: 'оплачено' },
  { obj: 0, start: 5,  end: 9,  guest: 'Анна Морозова', price: 31200, status: 'ota', code: 'loading', codeNum: '1573#', phone: '+7 903 555-19-04', ch: 'web', guests: 3, src: 'Островок', paid: 'ожидает оплату' },
  { obj: 1, start: 4,  end: 8,  guest: 'Дмитрий Власов', price: 45600, status: 'confirmed', code: 'loaded', codeNum: '6042#', phone: '+7 911 042-30-88', ch: 'max', guests: 2, src: 'Прямая',   paid: 'оплачено' },
  { obj: 1, start: 11, end: 15, guest: 'Ника Орлова', price: 28000, status: 'prepay', code: 'loading', codeNum: '7781#', phone: '+7 905 770-12-55', ch: 'wa',  guests: 1, src: 'Суточно',  paid: 'предоплата 30%' },
  { obj: 2, start: -2, end: 13, guest: 'Ольга Пермякова', price: 142000, status: 'prepay', code: 'loaded', codeNum: '3310#', phone: '+7 962 130-44-09', ch: 'tg',  guests: 6, src: 'Прямая',   paid: 'предоплата 50%' },
  { obj: 3, start: -3, end: -1, guest: 'Пётр Сухов', price: 14000, status: 'confirmed', code: 'loaded', codeNum: '5567#', phone: '+7 925 818-77-10', ch: 'max', guests: 1, src: 'Авито',    paid: 'оплачено' },
  { obj: 3, start: 0,  end: 1,  guest: 'Игорь Лапин', price: 9800, status: 'confirmed', code: 'loaded', codeNum: '2204#', phone: '+7 977 318-26-71', ch: 'tg',  guests: 1, src: 'Авито',    paid: 'оплачено' },
  { obj: 3, start: 5,  end: 7,  guest: 'Мария Седова', price: 16500, status: 'ota', code: 'loading', codeNum: '8890#', phone: '+7 999 404-88-12', ch: 'web', guests: 2, src: 'Островок', paid: 'ожидает оплату' },
  { obj: 4, start: 3,  end: 9,  guest: 'Павел Рогов', price: 38900, status: 'confirmed', code: 'notloaded', codeNum: '6963#', phone: '+7 900 111-22-33', ch: 'max', guests: 4, src: 'Прямая',   paid: 'оплачено' },
  { obj: 4, start: 10, end: 12, guest: 'Елена Брагина', price: 12600, status: 'ota', code: 'loading', codeNum: '1102#', phone: '+7 909 654-32-10', ch: 'web', guests: 2, src: 'Островок', paid: 'ожидает оплату' },
];

// «Требует действия» — операционная очередь на дашборде
const TASKS = [
  { tone: 'red',   icon: 'key-round',      obj: 'Невский 8',      text: 'Код не загружен в замок', who: 'Павел Рогов', action: 'Повторить' },
  { tone: 'amber', icon: 'wifi-off',       obj: 'Загородный дом', text: 'Замок офлайн с 12:30',     who: '',            action: 'Проверить' },
  { tone: 'sky',   icon: 'message-square', obj: 'Тверская 15',    text: 'Гость молчит 2 часа',      who: 'Анна Морозова', action: 'Открыть чат' },
];

// trend: 7 точек 0..1 для sparkline (выше = больше)
const KPI = [
  { key: 'revenue',   icon: 'wallet',       label: 'Выручка за месяц', value: '245k', unit: '₽', delta: '+12%', trend: [0.30, 0.42, 0.38, 0.55, 0.60, 0.72, 0.85] },
  { key: 'ai',        icon: 'bot',          label: 'AI справляется',   value: '78',   unit: '%', delta: '+5%',  trend: [0.50, 0.55, 0.62, 0.58, 0.70, 0.75, 0.82] },
  { key: 'locks',     icon: 'battery-low',  label: 'Замки требуют внимания', value: '1', unit: '', delta: 'открыть журнал', trend: [0.20, 0.15, 0.18, 0.10, 0.25, 0.40, 0.55] },
  { key: 'occupancy', icon: 'trending-up',  label: 'Загрузка',          value: '72',   unit: '%', delta: '+8%',  trend: [0.45, 0.48, 0.55, 0.60, 0.62, 0.68, 0.75] },
];

const NAV = [
  { icon: 'house', label: 'Главная', active: true },
  { icon: 'message-square', label: 'Чаты', badge: 3 },
  { icon: 'zap', label: 'Автоматизация' },
  { icon: 'calendar', label: 'Брони' },
  { icon: 'building-2', label: 'Объекты' },
  { icon: 'lock', label: 'Замки' },
  { icon: 'chart-column', label: 'Аналитика' },
];

function lastName(guest) { return guest.split(' ').slice(-1)[0]; }

// Раскладка броней строки-объекта внутри окна [windowStart .. windowStart+13].
// Возвращает массив сегментов для отрисовки: {l0, l1, isStart, isEnd, booking, labelAt}
function layoutSegments(objIdx, windowStart) {
  const wEnd = windowStart + 13;
  const segs = [];
  BOOKINGS.filter((b) => b.obj === objIdx).forEach((b) => {
    const vs = Math.max(b.start, windowStart);
    const ve = Math.min(b.end, wEnd);
    if (vs > ve) return; // вне окна
    segs.push({
      l0: vs - windowStart,            // локальный индекс начала (0..13)
      l1: ve - windowStart,            // локальный индекс конца
      isStart: vs === b.start,         // настоящий заезд виден (half-day слева)
      isEnd: ve === b.end,             // настоящий выезд виден (half-day справа)
      booking: b,
    });
  });
  return segs;
}
