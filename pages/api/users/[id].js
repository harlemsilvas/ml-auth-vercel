// pages/api/users/[id].js
import { getSellerInfo } from "@/services/user-service";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const userInfo = await getSellerInfo(parseInt(id));
    res.status(200).json(userInfo);
  } catch (error) {
    console.error("[Erro ao buscar usuário]", error.message);
    res.status(500).json({ error: error.message });
  }
}
