// pages/admin/vendedores.js
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";

export default function AdminSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSellersWithInfo();
  }, []);

  const loadSellersWithInfo = async () => {
    try {
      const res = await fetch("/api/auth/sellers");
      const sellerList = await res.json();

      // Para cada vendedor, busca o nickname
      const sellersWithInfo = await Promise.all(
        sellerList.map(async (seller) => {
          try {
            const userInfoRes = await fetch(`/api/users/${seller.user_id}`);
            const userInfo = await userInfoRes.json();
            return {
              ...seller,
              nickname: userInfo.nickname || "Sem nickname",
            };
          } catch (err) {
            return { ...seller, nickname: "Erro ao carregar" };
          }
        })
      );

      setSellers(sellersWithInfo);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout activePage="admin">
      <h1>👥 Vendedores Conectados</h1>
      {loading ? (
        <p>Carregando informações...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {sellers.map((seller) => (
            <li
              key={seller.user_id}
              style={{
                border: "1px solid #ddd",
                margin: "10px 0",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              <strong>Nickname:</strong> {seller.nickname} <br />
              <strong>ID:</strong> {seller.user_id} <br />
              <strong>Conectado em:</strong>{" "}
              {new Date(seller.created_at).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
