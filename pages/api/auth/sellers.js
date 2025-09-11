// pages/api/auth/sellers.js
import { getAllSellers } from "../../services/token-manager";

export default async function handler(req, res) {
  try {
    const sellers = await getAllSellers();
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
