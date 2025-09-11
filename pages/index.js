// pages/index.js
import { useEffect, useState } from "react";
import Layout from "../components/Layout";

export default function Home() {
  const [tokenInfo, setTokenInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTokenStatus();
  }, []);

  const fetchTokenStatus = async () => {
    try {
      const res = await fetch("/api/auth/current-token");
      const data = await res.json();
      setTokenInfo(data);
    } catch (err) {
      setTokenInfo({ error: "Falha ao carregar token" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1>🔐 Painel de Autenticação ML</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : tokenInfo?.error ? (
        <div>
          <p style={{ color: "red" }}>❌ {tokenInfo.error}</p>
          <button onClick={() => (window.location.href = "/api/auth/login")}>
            Conectar ao Mercado Livre
          </button>
        </div>
      ) : (
        <div>
          <p>✅ Conectado como vendedor</p>
          <p>
            <strong>User ID:</strong> {tokenInfo.user_id}
          </p>
          <p>
            <strong>Token válido por:</strong>{" "}
            {Math.floor(tokenInfo.expires_in / 60)} minutos
          </p>
        </div>
      )}

      <hr style={{ margin: "40px 0" }} />
      <h3>Próximos passos</h3>
      <ul>
        <li>
          <a href="/zpl">🖨️ Baixar etiquetas ZPL</a>
        </li>
        <li>
          <a href="/pedidos">📦 Ver pedidos recentes</a>
        </li>
      </ul>
    </Layout>
  );
}
