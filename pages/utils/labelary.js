// utils/labelary.js
export function getLabelaryUrl(zpl) {
  // Codifica o ZPL para enviar como parâmetro
  const encodedZpl = encodeURIComponent(zpl.trim());
  return `https://www.labelary.com/viewer.html?p=1&d=8&pp=1&s=2&w=4&h=6&f=hex&file=${encodedZpl}`;
}
