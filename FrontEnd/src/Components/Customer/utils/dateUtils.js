// dateUtils.js
export function daysInMonth(year, month) {
  // month is 1-12
  return new Date(year, month, 0).getDate();
}

export function generateCalendarMatrix(year, month) {
  // Returns array of weeks, each week = array of 7 cells (number or null)
  const firstDayWeekday = new Date(year, month - 1, 1).getDay(); // 0..6 (Sun..Sat)
  const totalDays = daysInMonth(year, month);
  const weeks = [];
  let current = 1;

  for (let r = 0; r < 6; r++) {
    const week = [];
    for (let c = 0; c < 7; c++) {
      if ((r === 0 && c < firstDayWeekday) || current > totalDays) {
        week.push(null);
      } else {
        week.push(current++);
      }
    }
    weeks.push(week);
    if (current > totalDays) break;
  }
  return weeks;
}

export function monthKey(year, month) {
  const mm = month < 10 ? "0" + month : "" + month;
  return `${year}-${mm}`;
}
