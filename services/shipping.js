// services/shipping.js
import { getValidToken } from "./token-manager";

/**
 * Baixa o código ZPL de uma etiqueta de envio
 * @param {string} shipmentId - Ex: '1234567890'
 * @returns {Promise<string>} Código ZPL
 */
export async function downloadZPL(shipmentId) {
  const token = await getValidToken();
  const url = `https://api.mercadolibre.com/shipment_labels?shipment_ids=${shipmentId}&response_type=zpl2`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      Accept: "application/vnd.mercadolibre.v1+text",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Falha ao baixar ZPL: ${response.status} - ${errorText}`);
  }

  const zpl = await response.text();
  if (!zpl.trim().startsWith("^XA")) {
    throw new Error("Resposta não é um ZPL válido");
  }

  return zpl;
}
