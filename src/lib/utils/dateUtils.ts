/**
 * Форматирует дату из строки в формате DD.MM.YYYY
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const [day, month, year] = dateStr.split('.');
    return `${day}.${month}.${year}`;
  } catch {
    return dateStr;
  }
}