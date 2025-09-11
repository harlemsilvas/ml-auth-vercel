// pages/api/orders/index.js
import { fetchSellerOrders } from "@/services/orders";

export default async function handler(req, res) {
  const { seller_id, limit = 10 } = req.query;

  if (!seller_id) {
    return res.status(400).json({
      error: "Parâmetro obrigatório: seller_id",
    });
  }

  try {
    const orders = await fetchSellerOrders(
      parseInt(seller_id),
      parseInt(limit)
    );

    // Garantir que sempre retornamos um array
    res.status(200).json({
      orders: Array.isArray(orders) ? orders : [],
    });
  } catch (error) {
    console.error("[API] Erro ao buscar pedidos:", error.message);
    res.status(500).json({
      error: "Falha ao buscar pedidos",
      details: error.message,
    });
  }
}
