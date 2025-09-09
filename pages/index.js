// pages/index.js
import { useEffect, useState } from "react";

export default function Home() {
  const [tokenInfo, setTokenInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTokenStatus();
  }, []);

  const fetchTokenStatus = async () => {
    try {
      const res = await fetch("/api/auth/token");
      const data = await res.json();
      setTokenInfo(data);
    } catch (err) {
      setTokenInfo({ error: "Falha ao carregar token" });
    }
  };

  const handleLogin = () => {
    setLoading(true);
    window.location.href = "/api/auth/login";
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>🔐 Autenticação Mercado Livre</h1>

      {tokenInfo?.error && <p style={{ color: "red" }}>❌ {tokenInfo.error}</p>}

      {tokenInfo?.access_token ? (
        <div>
          <p>✅ Autenticado com sucesso!</p>
          <p>
            <strong>User ID:</strong> {tokenInfo.user_id}
          </p>
          <p>
            <strong>Expira em:</strong>{" "}
            {new Date(
              Date.now() + tokenInfo.expires_in * 1000
            ).toLocaleTimeString()}
          </p>
          <button onClick={fetchTokenStatus} disabled={loading}>
            Atualizar
          </button>
        </div>
      ) : (
        <div>
          <p>
            🔒 Não autenticado. Conecte-se para acessar a API do Mercado Livre.
          </p>
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#fff",
              color: "#2C2C2C",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {loading ? "Redirecionando..." : "Conectar ao Mercado Livre"}
          </button>
        </div>
      )}

      <hr style={{ margin: "40px 0" }} />
      <h3>Informações do App</h3>
      <p>
        <strong>Client ID:</strong>{" "}
        {process.env.NEXT_PUBLIC_CLIENT_ID || "Não definido"}
      </p>
      <p>
        <strong>Status:</strong>{" "}
        {tokenInfo?.access_token ? "✅ Conectado" : "❌ Desconectado"}
      </p>
    </div>
  );
}
