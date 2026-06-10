// Общие данные для всех 3 вариантов мокапа Главной кабинета хоста Бронист.
// Меняем данные здесь — все варианты подхватывают.

// 14 дней начиная с "сегодня" (27.05.2026)
const START = new Date(2026, 4, 27);
const WD = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const DAYS = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(START);
  d.setDate(START.getDate() + i);
  return {
    idx: i,
    day: d.getDate(),
    wd: WD[d.getDay()],
    weekend: d.getDay() === 0 || d.getDay() === 6,
    today: i === 0,
  };
});

// Объекты (строки шахматки)
const OBJECTS = [
  { name: 'Тверская 15', sub: 'Студия · центр' },
  { name: 'Бизнес-Центр', sub: 'Апартаменты' },
  { name: 'Загородный дом', sub: '4 спальни' },
  { name: 'Арбат 24', sub: '2-комн.' },
  { name: 'Невский 8', sub: 'Студия' },
];

// Брони: obj = индекс объекта, start/end = индексы дней [включительно],
// status: 'ok' обычная, 'today' заезд сегодня, 'lock' проблема с кодом замка
const BOOKINGS = [
  { obj: 0, start: 0, end: 3, guest: 'Сергей Котов', initials: 'СК', status: 'today' },
  { obj: 0, start: 5, end: 9, guest: 'Анна Морозова', initials: 'АМ', status: 'ok' },
  { obj: 1, start: 4, end: 8, guest: 'Дмитрий Власов', initials: 'ДВ', status: 'ok' },
  { obj: 2, start: 0, end: 13, guest: 'Ольга Пермякова', initials: 'ОП', status: 'ok' },
  { obj: 3, start: 0, end: 1, guest: 'Игорь Лапин', initials: 'ИЛ', status: 'ok' },
  { obj: 3, start: 5, end: 7, guest: 'Мария Седова', initials: 'МС', status: 'ok' },
  { obj: 4, start: 3, end: 9, guest: 'Павел Рогов', initials: 'ПР', status: 'lock' },
];

// KPI-ряд
const KPI = [
  { key: 'revenue', icon: 'wallet', label: 'Выручка за месяц', value: '245k', unit: '₽', tone: 'neutral', delta: '+12%' },
  { key: 'ai', icon: 'bot', label: 'AI справляется', value: '78', unit: '%', tone: 'emerald', delta: '+5%' },
  { key: 'locks', icon: 'battery-low', label: 'Замки', value: '1', unit: '⚠', tone: 'amber', delta: 'нужно внимание' },
  { key: 'occupancy', icon: 'trending-up', label: 'Загрузка', value: '72', unit: '%', tone: 'neutral', delta: '+8%' },
];

// Эскалации (для алерт-ленты)
const ESCALATIONS = 2;

// Пункты sidebar
const NAV = [
  { icon: 'house', label: 'Главная', active: true },
  { icon: 'message-square', label: 'Чаты', badge: 3 },
  { icon: 'zap', label: 'Автоматизация' },
  { icon: 'calendar', label: 'Брони' },
  { icon: 'building-2', label: 'Объекты' },
  { icon: 'lock', label: 'Замки' },
  { icon: 'chart-column', label: 'Аналитика' },
];

// Фамилия гостя (последнее слово имени) — для подписи на полосе брони
function lastName(guest) {
  return guest.split(' ').slice(-1)[0];
}

// Построить раскладку броней по строке-объекту в виде массива из 14 ячеек.
// Каждая ячейка: null (свободно) или {pos, booking, first, label}
// pos: 'start'|'mid'|'end'|'single' — для half-day offset на торцах (как в RealtyCalendar)
// label: true — на этой ячейке печатаем фамилию гостя
function layoutRow(objIdx) {
  const cells = new Array(14).fill(null);
  BOOKINGS.filter((b) => b.obj === objIdx).forEach((b) => {
    // Ячейка для подписи: первая ПОЛНАЯ (start+1), иначе сам start
    const labelCell = b.end > b.start ? b.start + 1 : b.start;
    for (let i = b.start; i <= b.end; i++) {
      let pos = 'mid';
      if (b.start === b.end) pos = 'single';
      else if (i === b.start) pos = 'start';
      else if (i === b.end) pos = 'end';
      cells[i] = { pos, booking: b, first: i === b.start, label: i === labelCell };
    }
  });
  return cells;
}
