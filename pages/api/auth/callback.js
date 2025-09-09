// pages/api/auth/callback.js
import fetch from "node-fetch";

// Função para testar se o domínio é acessível
async function testDNS() {
  try {
    const response = await fetch("https://httpbin.org/get", { timeout: 5000 });
    return response.ok;
  } catch (err) {
    console.error("Falha no teste de rede:", err.message);
    return false;
  }
}

export default async function handler(req, res) {
  const isNetworkOk = await testDNS();
  if (!isNetworkOk) {
    return res
      .status(500)
      .json({ error: "Falha de rede: DNS ou conectividade" });
  }

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
    params.append("client_id", process.env.CLIENT_ID);
    params.append("client_secret", process.env.CLIENT_SECRET);
    params.append("code", code);
    params.append("redirect_uri", redirectUri);

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const data = await response.json();

    if (!response.ok) {
      return res
        .status(400)
        .json({ error: "Falha ao obter token", details: data });
    }

    // Salva no cookie (seguro)
    res.setHeader("Set-Cookie", [
      `ml_access_token=${data.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=21600`,
      `ml_refresh_token=${data.refresh_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=15552000`,
      `ml_user_id=${data.user_id}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=21600`,
    ]);

    res.redirect("/");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
