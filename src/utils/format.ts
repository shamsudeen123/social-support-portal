export const numeral = (n: number | string, lang: string): string =>
  lang === 'ar' ? Number(n).toLocaleString('ar-EG') : String(n);
