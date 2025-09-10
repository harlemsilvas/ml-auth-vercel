// pages/api/auth/token.js
import dbConnect from "../../../lib/mongodb";
import Token from "../../../models/Token";

export default async function handler(req, res) {
  await dbConnect();
  const token = await Token.findOne().sort({ created_at: -1 }).exec();

  if (!token) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  res.json({
    access_token: token.access_token,
    user_id: token.user_id,
    expires_in: token.expires_in,
  });
}
