// pages/api/auth/token.js
export default function handler(req, res) {
  const accessToken = req.cookies?.ml_access_token;
  const refreshToken = req.cookies?.ml_refresh_token;
  const userId = req.cookies?.ml_user_id;

  if (!accessToken) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  res.json({
    access_token: accessToken,
    refresh_token: refreshToken,
    user_id: userId,
    expires_in: 21600,
  });
}
