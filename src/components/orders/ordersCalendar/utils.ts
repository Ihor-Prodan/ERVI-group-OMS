export const getDayColor = (count: number, deliveredCount: number, isToday: boolean) => {
  if (isToday) {
    return '#fef3c7';
  }
  
  if (count >= 1 || deliveredCount >= 1) {
    return '#bddeffff';
  }

  return '#eee';
};

export const isWeekend = (year: number, month: number, day: number) => {
  const dow = new Date(year, month, day).getDay();

  return dow === 6 || dow === 0;
};