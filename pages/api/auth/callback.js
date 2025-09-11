// pages/api/auth/callback.js
import { exchangeCodeForToken } from "../../../services/token-manager";

export default async function handler(req, res) {
  const { code, state } = req.query;
  const savedState = req.cookies?.auth_state;

  if (state !== savedState) {
    return res.status(401).json({ error: "CSRF: state inválido" });
  }

  try {
    const redirectUri = `https://${req.headers.host}/api/auth/callback`;
    const token = await exchangeCodeForToken(code, redirectUri);

    // Define cookies seguros
    res.setHeader("Set-Cookie", [
      `ml_access_token=${token.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=21600`,
      `ml_user_id=${token.user_id}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=21600`,
    ]);

    res.redirect("/");
  } catch (error) {
    console.error("[Callback] Erro ao processar autenticação", error);
    res.status(500).json({
      error: "Erro interno ao processar autenticação",
      message: error.message,
    });
  }
}
