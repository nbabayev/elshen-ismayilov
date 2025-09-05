export function formatDateISO(dateISO, locale = "az-AZ") {
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
  const d = new Date(dateISO + "T00:00:00");
  console.log(d.getDate());
  return `${d.getDate()} ${monthsAZ[d.getUTCMonth()]}`;
}
