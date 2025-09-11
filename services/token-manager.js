// services/token-manager.js
import fetch from "node-fetch";
import dbConnect from "../lib/mongodb";
import Token from "../models/Token";

/**
 * Retorna todos os vendedores conectados
 */
export async function getAllSellers() {
  await dbConnect();
  return await Token.find({}, "user_id created_at").sort({ created_at: -1 });
}

console.log("Função getAllSellers carregada");

/**
 * Função principal: troca code por token e salva no banco
 */
export async function exchangeCodeForToken(code, redirectUri) {
  await dbConnect();

  try {
    const response = await fetch("https://api.mercadolibre.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Falha na API: ${data.error} - ${data.message}`);
    }

    // Salva no banco
    const newToken = await Token.create({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user_id: data.user_id,
      expires_in: data.expires_in,
    });

    console.log("[Token] Novo token salvo para user_id:", data.user_id);
    return newToken;
  } catch (error) {
    console.error("[Erro ao trocar code por token]", error.message);
    throw error;
  }
}

/**
 * Renova o token usando o refresh_token mais recente
 */
export async function refreshAccessToken() {
  await dbConnect();

  const latestToken = await Token.findOne().sort({ created_at: -1 }).exec();
  if (!latestToken) {
    throw new Error("Nenhum token encontrado para renovar");
  }

  try {
    const response = await fetch("https://api.mercadolibre.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: latestToken.refresh_token,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Falha ao renovar: ${data.error} - ${data.message}`);
    }

    const renewedToken = await Token.create({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user_id: data.user_id,
      expires_in: data.expires_in,
    });

    console.log("[Token] Renovado com sucesso para user_id:", data.user_id);
    return renewedToken;
  } catch (error) {
    console.error("[Erro ao renovar token]", error.message);
    throw error;
  }
}

/**
 * Obtém o token válido atual (renova se necessário)
 */
export async function getValidToken() {
  await dbConnect();

  let token = await Token.findOne().sort({ created_at: -1 }).exec();
  if (!token) {
    throw new Error("Nenhum token registrado. Inicie o fluxo OAuth.");
  }

  const now = Date.now();
  const tokenAge = now - new Date(token.created_at).getTime();
  const expiresInMs = token.expires_in * 1000;

  if (tokenAge > expiresInMs - 60000) {
    // Renova 1 min antes
    console.log("[Token] Próximo de expirar. Renovando...");
    token = await refreshAccessToken();
  }

  return token;
}
