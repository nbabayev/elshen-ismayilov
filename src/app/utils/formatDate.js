const monthsAZ = [
  "yanvar",
  "fevral",
  "mart",
  "aprel",
  "may",
  "iyun",
  "iyul",
  "avqust",
  "sentyabr",
  "oktyabr",
  "noyabr",
  "dekabr",
];

export function articleDetailDateFormat(dateISO) {
  const d = new Date(dateISO);
  return `${d.getDate()} ${monthsAZ[d.getUTCMonth()]}, ${d.getFullYear()}`;
}

export function formatDateISO(dateISO, reverse = false) {
  const d = new Date(dateISO);
  return reverse
    ? `${monthsAZ[d.getUTCMonth()]} ${d.getDate()}`
    : `${d.getDate()} ${monthsAZ[d.getUTCMonth()]}`;
}
