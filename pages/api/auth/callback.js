// pages/api/auth/callback.js
import axios from "axios";
import dbConnect from "../../lib/mongodb";
import Token from "../../models/Token";

export default async function handler(req, res) {
  const { code, state } = req.query;
  const savedState = req.cookies?.auth_state;

  if (state !== savedState) {
    return res.status(401).json({ error: "CSRF: state inválido" });
  }

  await dbConnect();

  try {
    const tokenUrl = "https://api.mercadolibre.com/oauth/token";
    const redirectUri = `https://${req.headers.host}/api/auth/callback`;

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", process.env.MERCADO_LIVRE_APP_ID);
    params.append("client_secret", process.env.MERCADO_LIVRE_SECRET_KEY);
    params.append("code", code);
    params.append("redirect_uri", redirectUri);

    const response = await axios.post(tokenUrl, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const data = response.data;

    // Salva novo token
    await Token.create({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user_id: data.user_id,
      expires_in: data.expires_in,
    });

    res.setHeader("Set-Cookie", [
      `ml_access_token=${data.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=21600`,
      `ml_user_id=${data.user_id}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=21600`,
    ]);

    res.redirect("/");
  } catch (error) {
    console.error("[Erro no callback]", error.response?.data || error.message);
    res.status(500).json({ error: "Falha ao obter token" });
  }
}
