// utils/format.js
export function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("pt-BR");
}
