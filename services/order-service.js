// services/order-service.js
import { getValidToken } from "./token-manager";

export async function fetchSellerOrders(sellerId, limit = 50) {
  const token = await getValidToken(sellerId);

  const url = `https://api.mercadolibre.com/orders/search?seller=${sellerId}&limit=${limit}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Erro desconhecido");
    throw new Error(`Falha na API: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  // Mapeia TODOS os pedidos retornados (sem filtrar por ready_to_ship)
  return (data.results || []).map((order) => ({
    id: order.id,
    status: order.status,
    date_created: order.date_created,
    total_amount: order.total_amount,
    buyer: order.buyer.nickname,
    shipping: order.shipping || null,
    shipping_status: order.shipping?.status || "Não iniciado",
  }));
}
