// pages/api/auth/login.js
export default function handler(req, res) {
  const clientId = process.env.CLIENT_ID;
  const redirectUri = `https://${req.headers.host}/api/auth/callback`;
  const state = Math.random().toString(36).substring(7);

  // Salva state no cookie
  res.setHeader(
    "Set-Cookie",
    `auth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax`
  );

  const authUrl =
    `https://auth.mercadolibre.com.br/authorization?` +
    `response_type=code&` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `state=${state}`;

  res.redirect(authUrl);
}
