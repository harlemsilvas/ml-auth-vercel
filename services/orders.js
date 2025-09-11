// services/orders.js
import { getValidToken } from "./token-manager";

export async function fetchSellerOrders(sellerId, limit = 10) {
  const token = await getValidToken(sellerId);
  const url = `https://api.mercadolibre.com/orders/search?seller=${sellerId}&limit=${limit}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Falha ao buscar pedidos: ${response.status} - ${errorText}`
    );
  }

  const data = await response.json();

  return (data.results || []).map((order) => ({
    id: order.id,
    status: order.status,
    date_created: order.date_created,
    total_amount: order.total_amount,
    buyer: order.buyer.nickname,
    shipment_id: order.shipping?.id || null,
    shipping_status: order.shipping?.status,
  }));
}
