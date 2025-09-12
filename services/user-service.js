// services/user-service.js
import { getValidToken } from "./token-manager";

/**
 * Busca informações de um vendedor pelo user_id
 */
export async function getSellerInfo(userId) {
  const token = await getValidToken(userId);

  const response = await fetch(`https://api.mercadolibre.com/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao buscar dados do vendedor: ${response.status}`);
  }

  return await response.json();
}
