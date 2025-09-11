// pages/pedidos/index.js
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";

export default function PedidosPage() {
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carregar vendedores conectados
  useEffect(() => {
    fetch("/api/auth/sellers")
      .then((r) => r.json())
      .then((data) => {
        setSellers(data);
        if (data.length > 0) setSelectedSeller(data[0].user_id);
      })
      .catch((err) => console.error(err));
  }, []);

  // Carregar pedidos do vendedor selecionado
  useEffect(() => {
    if (selectedSeller) loadOrders();
  }, [selectedSeller]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/orders?seller_id=${selectedSeller}&limit=20`
      );
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Erro ao carregar pedidos", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1>📦 Pedidos Recentes</h1>

      <div style={{ marginBottom: "20px" }}>
        <label>Escolha o vendedor: </label>
        <select
          value={selectedSeller}
          onChange={(e) => setSelectedSeller(e.target.value)}
          style={{ padding: "8px", fontSize: "16px" }}
        >
          {sellers.map((s) => (
            <option key={s.user_id} value={s.user_id}>
              Vendedor {s.user_id}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Carregando pedidos...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {orders.length === 0 ? (
            <li>Nenhum pedido encontrado.</li>
          ) : (
            orders.map((order) => (
              <li
                key={order.id}
                style={{
                  border: "1px solid #ddd",
                  margin: "10px 0",
                  padding: "15px",
                  borderRadius: "8px",
                }}
              >
                <strong>Pedido:</strong> {order.id} <br />
                <strong>Status:</strong> {order.status} <br />
                <strong>Data:</strong>{" "}
                {new Date(order.date_created).toLocaleString()} <br />
                <strong>Total:</strong> R$ {order.total_amount?.toFixed(2)}{" "}
                <br />
                <strong>Comprador:</strong> {order.buyer.nickname} <br />
                <strong>Shipment ID:</strong>{" "}
                {order.shipping?.id || "Não disponível"}
              </li>
            ))
          )}
        </ul>
      )}
    </Layout>
  );
}
