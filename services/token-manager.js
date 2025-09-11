// services/token-manager.js
import fetch from "node-fetch";
import dbConnect from "../lib/mongodb";
import Token from "../models/Token";

/**
 * Salva ou atualiza o token de um vendedor
 */
export async function saveTokenFromCode(code, redirectUri) {
  await dbConnect();

  try {
    const response = await fetch("https://api.mercadolibre.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(`Falha na API: ${data.error}`);

    // Atualiza ou cria novo token
    const token = await Token.findOneAndUpdate(
      { user_id: data.user_id },
      {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
      },
      { upsert: true, new: true }
    );

    console.log("[Token] Salvo para vendedor:", data.user_id);
    return token;
  } catch (error) {
    console.error("[Erro ao salvar token]", error.message);
    throw error;
  }
}

/**
 * Renova o token de um vendedor específico
 */
export async function refreshAccessToken(user_id) {
  await dbConnect();
  const token = await Token.findOne({ user_id });
  if (!token) throw new Error("Vendedor não encontrado");

  try {
    const response = await fetch("https://api.mercadolibre.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: token.refresh_token,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(`Falha ao renovar: ${data.error}`);

    const updated = await Token.findOneAndUpdate(
      { user_id },
      {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
      },
      { new: true }
    );

    console.log("[Token] Renovado para vendedor:", user_id);
    return updated;
  } catch (error) {
    console.error("[Erro ao renovar]", error.message);
    throw error;
  }
}

/**
 * Obtém token válido para um vendedor
 */
export async function getValidToken(user_id) {
  await dbConnect();
  let token = await Token.findOne({ user_id });
  if (!token) throw new Error("Nenhum token registrado para este vendedor");

  const now = Date.now();
  const tokenAge = now - token.created_at.getTime();
  const expiresInMs = token.expires_in * 1000;

  if (tokenAge > expiresInMs - 60000) {
    console.log(`[Token] Renovando para vendedor ${user_id}`);
    token = await refreshAccessToken(user_id);
  }

  return token;
}

/**
 * Lista todos os vendedores conectados
 */
export async function getAllSellers() {
  await dbConnect();
  return await Token.find({}, "user_id created_at").sort({ created_at: -1 });
}
