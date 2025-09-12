// pages/api/orders/index.js
import { getValidToken } from "@/services/token-manager";
import { fetchSellerOrders } from "@/services/order-service";

export default async function handler(req, res) {
  const { seller_id } = req.query;

  if (!seller_id) {
    return res.status(400).json({ error: "seller_id obrigatório" });
  }

  try {
    // Usa o serviço modularizado
    const orders = await fetchSellerOrders(parseInt(seller_id));
    res.status(200).json({ orders });
  } catch (error) {
    console.error("[API] Erro ao buscar pedidos:", error.message);
    res.status(500).json({
      error: "Falha ao buscar pedidos",
      details: error.message,
    });
  }
}
