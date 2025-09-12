// pages/api/orders/seller.js
import { getValidToken } from "@/services/token-manager";

export default async function handler(req, res) {
  const { seller_id } = req.query;

  if (!seller_id) {
    return res.status(400).json({ error: "Parâmetro obrigatório: seller_id" });
  }

  try {
    // 1. Obter token válido para o vendedor
    const token = await getValidToken(parseInt(seller_id));

    // 2. Chamar a API do Mercado Livre
    const mlUrl = `https://api.mercadolibre.com/orders/search?seller=${seller_id}`;

    const response = await fetch(mlUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Erro da API ML: ${response.status} - ${
          errorData.message || "Erro desconhecido"
        }`
      );
    }

    const data = await response.json();

    // 3. Retornar os dados ao frontend
    res.status(200).json(data);
  } catch (error) {
    console.error("[API] Falha ao buscar pedidos:", error.message);
    res.status(500).json({
      error: "Falha ao buscar pedidos",
      details: error.message,
    });
  }
}
