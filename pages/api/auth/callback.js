// pages/api/auth/callback.js
import fetch from "node-fetch";

async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      if (i === retries - 1) throw error; // Lança erro na última tentativa
      console.log(
        `🔁 Tentativa ${i + 1} falhou, esperando ${1000 * (i + 1)}ms...`
      );
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// Necessário para Vercel (Node 18+)
if (!globalThis.fetch) {
  globalThis.fetch = fetch;
}

export default async function handler(req, res) {
  const { code, state } = req.query;
  const savedState = req.cookies?.auth_state;

  if (state !== savedState) {
    return res.status(401).json({ error: "CSRF: state inválido" });
  }

  try {
    const tokenUrl = "https://api.mercadolivre.com/oauth/token";
    const redirectUri = `https://${req.headers.host}/api/auth/callback`;

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", process.env.MERCADO_LIVRE_APP_ID);
    params.append("client_secret", process.env.MERCADO_LIVRE_SECRET_KEY);
    params.append("code", code);
    params.append("redirect_uri", redirectUri);

    // const response = await fetch(tokenUrl, {
    const response = await fetchWithRetry(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        error: "Falha ao obter token",
        details: data,
      });
    }

    // Salva no cookie
    res.setHeader("Set-Cookie", [
      `ml_access_token=${data.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=21600`,
      `ml_refresh_token=${data.refresh_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=15552000`,
      `ml_user_id=${data.user_id}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=21600`,
    ]);

    res.redirect("/");
  } catch (error) {
    console.error("[Erro no callback]", error);
    res.status(500).json({
      error: "Erro interno ao processar autenticação",
      message: error.message,
    });
  }
}
