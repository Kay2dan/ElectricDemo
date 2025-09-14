// As we only have data in the Neon-db for August so we get data for fixed period

export function getDefaultStartDate(): Date {
  const now = new Date();
  const year = now.getFullYear();
  const d = new Date(year, 7, 20);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getDefaultEndDate(): Date {
  const now = new Date();
  const year = now.getFullYear();
  const d = new Date(year, 7, 26);
  d.setHours(23, 59, 59, 999);
  return d;
}
