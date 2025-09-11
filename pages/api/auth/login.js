// pages/api/auth/login.js
// atualização caminho mercadolivre.com.br
export default function handler(req, res) {
  const clientId = process.env.MERCADO_LIVRE_APP_ID;
  const host = req.headers.host;
  const protocol = host.includes("localhost") ? "http" : "https";
  // const redirectUri = `${protocol}://${host}/api/auth/callback`;
  const redirectUri = `https://ml-auth-vercel.vercel.app/api/auth/callback`;

  const state = Math.random().toString(36).substring(7);

  // Define o cookie com Secure apenas em produção
  const isSecure = !host.includes("localhost");
  const cookieFlags = [
    `auth_state=${state}; Path=/; HttpOnly`,
    isSecure ? "Secure" : "",
    "SameSite=Lax",
  ]
    .filter(Boolean)
    .join("; ");

  res.setHeader("Set-Cookie", cookieFlags);

  const authUrl =
    `https://auth.mercadolivre.com.br/authorization?` +
    `response_type=code&` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `state=${state}`;

  res.redirect(authUrl);
}
