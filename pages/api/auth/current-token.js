// pages/api/auth/current-token.js
import { getValidToken } from "@/services/token-manager";

export default async function handler(req, res) {
  try {
    const token = await getValidToken();
    res.json({
      access_token: token.access_token,
      user_id: token.user_id,
      expires_in: 21600,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
