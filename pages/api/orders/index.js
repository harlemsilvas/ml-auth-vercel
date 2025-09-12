// pages/api/orders/index.js
import { fetchSellerOrders } from "../../../services/order-service";

export default async function handler(req, res) {
  const { seller_id } = req.query;

  if (!seller_id) {
    return res.status(400).json({ error: "seller_id obrigatório" });
  }

  try {
    const orders = await fetchSellerOrders(parseInt(seller_id));
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message, orders: [] });
  }
}
