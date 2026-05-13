// Converts a number to locale-appropriate numerals (Arabic-Indic when lang is 'ar')
export const numeral = (n, lang) =>
  lang === 'ar' ? Number(n).toLocaleString('ar-EG') : String(n);
