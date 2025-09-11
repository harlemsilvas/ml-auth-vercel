// pages/api/zpl.js
import { getValidToken } from "@/services/token-manager";

export default async function handler(req, res) {
  const { shipment_id } = req.query;

  if (!shipment_id) {
    return res.status(400).json({ error: "Parâmetro shipment_id obrigatório" });
  }

  try {
    // Obter token válido
    const sellerId = parseInt(req.cookies.ml_user_id); // ou passe por query
    const token = await getValidToken(sellerId);

    // Montar URL completa
    const url = `https://api.mercadolibre.com/shipment_labels?shipment_ids=${shipment_id}&response_type=zpl2&access_token=${token.access_token}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/vnd.mercadolibre.v1+text",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ML API Error: ${response.status} - ${errorText}`);
    }

    const zpl = await response.text();

    if (!zpl.trim().startsWith("^XA")) {
      throw new Error("Resposta não é um código ZPL válido");
    }

    res.status(200).json({ zpl, shipment_id });
  } catch (error) {
    console.error("[Erro ao gerar ZPL]", error.message);
    res.status(500).json({ error: error.message });
  }
}
