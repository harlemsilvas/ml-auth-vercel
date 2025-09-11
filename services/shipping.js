// Exemplo: services/shipping.js
import { getValidToken } from "./token-manager";

export async function downloadZPL(shipmentId) {
  const token = await getValidToken();
  const url = `https://api.mercadolibre.com/shipment_labels?shipment_ids=${shipmentId}&response_type=zpl2`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });

  if (!response.ok) throw new Error("Falha ao baixar ZPL");

  return await response.text(); // Retorna o código ZPL
}
