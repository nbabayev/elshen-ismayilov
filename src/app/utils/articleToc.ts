export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, " "));
}

function normalizeHeadingText(text: string): string {
  return decodeEntities(text)
    .replace(/[–—−]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/ə/g, "e")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ş/g, "sh")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function uniqueId(base: string, used: Set<string>): string {
  const fallback = "bolme";
  let id = base || fallback;
  let i = 2;
  while (used.has(id)) {
    id = `${base || fallback}-${i}`;
    i += 1;
  }
  used.add(id);
  return id;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Mövcud məqalələrdə əl ilə yazılmış Mündəricat blokunu çıxarır. */
function extractManualToc(html: string): { html: string; titles: string[] } {
  const pattern =
    /<p[^>]*>\s*(?:<(?:strong|b)[^>]*>\s*)?M[uü]nd[əe]ricat\s*:?\s*(?:<\/(?:strong|b)>\s*)?<\/p>\s*<ul[^>]*>([\s\S]*?)<\/ul>/i;

  const match = html.match(pattern);
  if (!match) return { html, titles: [] };

  const titles = [...match[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((item) => stripTags(item[1]))
    .filter(Boolean);

  return {
    html: html.replace(pattern, ""),
    titles,
  };
}

/** TOC başlıqlarına uyğun gələn <p> bloklarını h2 + id edir. */
function promoteParagraphHeadings(
  html: string,
  titles: string[],
  used: Set<string>
): { html: string; items: TocItem[] } {
  let nextHtml = html;
  const items: TocItem[] = [];

  for (const title of titles) {
    const id = uniqueId(slugifyHeading(title), used);
    const flexible = title
      .split(/[\s\-–—−]+/)
      .filter(Boolean)
      .map(escapeRegExp)
      .join("[\\s\\-–—−]+");

    const paragraphPattern = new RegExp(
      `<p(\\s[^>]*)?>\\s*(?:<(?:strong|b)(?:\\s[^>]*)?>\\s*)?${flexible}\\s*(?:</(?:strong|b)>)?\\s*</p>`,
      "i"
    );

    if (paragraphPattern.test(nextHtml)) {
      nextHtml = nextHtml.replace(
        paragraphPattern,
        `<h2$1 id="${id}">${title}</h2>`
      );
    } else {
      let replaced = false;
      nextHtml = nextHtml.replace(
        /<p(\s[^>]*)?>([\s\S]*?)<\/p>/gi,
        (full, attrs = "", inner: string) => {
          if (replaced) return full;
          if (
            normalizeHeadingText(stripTags(inner)) !==
            normalizeHeadingText(title)
          ) {
            return full;
          }
          replaced = true;
          return `<h2${attrs || ""} id="${id}">${stripTags(inner)}</h2>`;
        }
      );
    }

    items.push({ id, text: title, level: 2 });
  }

  return { html: nextHtml, items };
}

function annotateNativeHeadings(
  html: string,
  used: Set<string>
): { html: string; items: TocItem[] } {
  const items: TocItem[] = [];

  const nextHtml = html.replace(
    /<(h[23])(\s[^>]*)?>([\s\S]*?)<\/\1>/gi,
    (match, tag: string, attrs = "", inner: string) => {
      const level = Number(tag.slice(1)) as 2 | 3;
      const text = stripTags(inner);
      if (!text) {
        return `<${tag}${attrs || ""}>${inner}</${tag}>`;
      }

      const existingId = /\sid\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1];
      // Artıq id yazılmış başlığı yenidən adlandırma — TOC linkləri qırılır.
      if (existingId) {
        used.add(existingId);
        items.push({ id: existingId, text, level });
        return match;
      }

      const id = uniqueId(slugifyHeading(text), used);
      items.push({ id, text, level });

      const cleanedAttrs = (attrs || "").trim();
      const attrPart = cleanedAttrs ? ` ${cleanedAttrs}` : "";
      return `<${tag}${attrPart} id="${id}">${inner}</${tag}>`;
    }
  );

  return { html: nextHtml, items };
}

/**
 * Məqalə HTML-indən mündəricat çıxarır:
 * 1) əl ilə yazılmış Mündəricat siyahısı
 * 2) native h2/h3
 * Uyğun bölmə başlıqlarına id əlavə edir.
 */
export function prepareArticleContent(html: string): {
  html: string;
  items: TocItem[];
} {
  if (!html) return { html: "", items: [] };

  const used = new Set<string>();
  const manual = extractManualToc(html);

  if (manual.titles.length > 0) {
    const promoted = promoteParagraphHeadings(manual.html, manual.titles, used);
    // Qalan native heading-lər də id alsın (TOC-a təkrar əlavə etmirik)
    const annotated = annotateNativeHeadings(promoted.html, used);
    return { html: annotated.html, items: promoted.items };
  }

  return annotateNativeHeadings(html, used);
}
