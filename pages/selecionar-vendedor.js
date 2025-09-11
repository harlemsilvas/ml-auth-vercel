// pages/selecionar-vendedor.js
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function SelecionarVendedor() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/sellers")
      .then((r) => r.json())
      .then((data) => {
        setSellers(data);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <h1>👥 Vendedores Conectados</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : sellers.length === 0 ? (
        <p>Nenhum vendedor conectado.</p>
      ) : (
        <ul>
          {sellers.map((seller) => (
            <li key={seller.user_id}>
              Vendedor ID: {seller.user_id} - Conectado em{" "}
              {new Date(seller.created_at).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
      <br />
      <a
        href="/api/auth/login"
        style={{
          padding: "10px 20px",
          backgroundColor: "#0070ba",
          color: "white",
          textDecoration: "none",
          borderRadius: "4px",
        }}
      >
        ➕ Conectar Novo Vendedor
      </a>
    </Layout>
  );
}
