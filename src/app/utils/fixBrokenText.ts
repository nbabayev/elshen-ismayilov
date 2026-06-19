export const fixBrokenText = (text: string): string => {
  if (!text) return "";

  try {
    // UTF-8 və Latin1 arasındakı sındırılmış baytları bərpa edirik
    return decodeURIComponent(escape(text));
  } catch (e) {
    // Əgər mətndə bəzi hissələr normaldırsa və error atarsa, əvəzləmə xəritəsi:
    let fixed = text;
    const replacements: { [key: string]: string } = {
      ãÅyyami: "Əyyami",
      ãÅYYAM: "Əyyami",
      "FAT—M": "FATİMƏ",
      YYãÅ: "YYƏ",
      "ã–": "Ö",
      "ã¼": "ü",
      "ã§": "ç",
      "ã¶": "ö",
      ãž: "Ş",
      ãŸ: "ş",
      "Ä±": "ı",
      ÄŸ: "ğ",
      Äž: "Ğ",
      "Ä°": "İ",
    };

    Object.keys(replacements).forEach((key) => {
      fixed = fixed.split(key).join(replacements[key]);
    });

    return fixed;
  }
};
