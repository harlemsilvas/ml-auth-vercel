// services/orders.js
export async function fetchSellerOrders(sellerId, limit = 50) {
  const token = await getValidToken(sellerId);
  const url = `https://api.mercadolibre.com/orders/search?seller=${sellerId}&limit=${limit}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });

  if (!response.ok) throw new Error("Falha ao buscar pedidos");

  const data = await response.json();
  const results = data.results || [];

  // Filtrar apenas pedidos do ano corrente (2025) ou últimos 7 dias
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return (
    results
      .filter((order) => {
        const orderDate = new Date(order.date_created);
        const isRecent = orderDate >= oneWeekAgo;
        const isReadyToShip = order.shipping?.status === "ready_to_ship";
        return isRecent && isReadyToShip;
      })
      // .filter((order) => {
      //   const orderDate = new Date(order.date_created);
      //   return orderDate >= oneWeekAgo; // Ajuste para 7 dias
      // })
      .map((order) => ({
        id: order.id,
        status: order.status,
        date_created: order.date_created,
        total_amount: order.total_amount,
        buyer: order.buyer.nickname,
        shipping: order.shipping || null,
      }))
  );
}
