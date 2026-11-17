export function birthAge(birth: string, on: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birth) || birth > on) return null;
  const date = new Date(birth + 'T12:00:00Z');
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== birth) return null;
  const [year, month, day] = on.split('-').map(Number);
  return (
    year -
    date.getUTCFullYear() -
    (month < date.getUTCMonth() + 1 || (month === date.getUTCMonth() + 1 && day < date.getUTCDate())
      ? 1
      : 0)
  );
}
export function birthDays(year: string, month: string) {
  if (!month) return 31;
  return new Date(Date.UTC(Number(year) || 2000, Number(month), 0)).getUTCDate();
}
