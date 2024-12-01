export function convertUTCDateToLocalDate(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
}
