// services/refresh-token.js
import axios from "axios";
import dbConnect from "../lib/mongodb";
import Token from "../models/Token";

export async function updateMercadoLivreRefreshToken() {
  await dbConnect();
  const lastToken = await Token.findOne().sort({ created_at: -1 }).exec();

  if (!lastToken) throw new Error("Nenhum token encontrado");

  try {
    const response = await axios.post(
      "https://api.mercadolibre.com/oauth/token",
      {
        grant_type: "refresh_token",
        client_id: process.env.MERCADO_LIVRE_APP_ID,
        client_secret: process.env.MERCADO_LIVRE_SECRET_KEY,
        refresh_token: lastToken.refresh_token,
      },
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const data = response.data;

    await Token.create({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user_id: data.user_id,
      expires_in: data.expires_in,
    });

    return data;
  } catch (error) {
    console.error("[Erro ao renovar token]", error.response?.data);
    throw error;
  }
}
