// pages/pedidos/index.js
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function PedidosPage() {
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSellers, setLoadingSellers] = useState(true);

  // Carregar vendedores conectados
  useEffect(() => {
    const loadSellers = async () => {
      try {
        const res = await fetch("/api/auth/sellers");
        const data = await res.json();
        setSellers(Array.isArray(data) ? data : []);
        if (data.length > 0) setSelectedSeller(data[0].user_id);
      } catch (err) {
        console.error("Erro ao carregar vendedores", err);
      } finally {
        setLoadingSellers(false);
      }
    };
    loadSellers();
  }, []);

  // Carregar pedidos do vendedor selecionado
  useEffect(() => {
    if (selectedSeller) {
      loadOrders();
    }
  }, [selectedSeller]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/orders?seller_id=${selectedSeller}&limit=20`
      );
      const data = await res.json();

      if (res.ok && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        console.error("Erro na API:", data);
        setOrders([]);
      }
    } catch (err) {
      console.error("Erro de conexão com /api/orders", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintClick = (shipmentId) => {
    window.open(`/zpl?shipment_id=${shipmentId}`, "_blank");
  };

  return (
    <Layout activePage="pedidos">
      <h1>📦 Pedidos Recentes</h1>

      {/* Seletor de vendedor */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>Escolha o vendedor:</label>
        {loadingSellers ? (
          <span>Carregando vendedores...</span>
        ) : (
          <select
            value={selectedSeller}
            onChange={(e) => setSelectedSeller(e.target.value)}
            style={{
              padding: "8px",
              fontSize: "16px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            {sellers.map((s) => (
              <option key={s.user_id} value={s.user_id}>
                {s.nickname || `Vendedor ${s.user_id}`}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Status de carregamento */}
      {loading ? (
        <p>🔄 Carregando pedidos...</p>
      ) : orders.length === 0 ? (
        <p>Nenhum pedido pronto para envio.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {orders.map((order) => (
            <li key={order.id}>
              <strong>Pedido:</strong> {order.id} |<strong> Status:</strong>{" "}
              {order.status} |<strong> Envio:</strong> {order.shipping_status} |
              <strong> Comprador:</strong> {order.buyer}
              {order.shipping?.id ? (
                <a
                  href={`/zpl?shipment_id=${order.shipping.id}`}
                  target="_blank"
                >
                  🖨️ Imprimir Etiqueta
                </a>
              ) : (
                <span style={{ color: "#999", marginLeft: "10px" }}>
                  → Sem shipment_id disponível
                </span>
              )}
            </li>
          ))}
          {/* {orders.map((order) => (
            <li
              key={order.id}
              style={{
                border: "1px solid #ddd",
                margin: "10px 0",
                padding: "15px",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#f9f9f9",
              }}
            >
              <div>
                <strong>Pedido:</strong> {order.id} <br />
                <strong>Status:</strong> {order.status} <br />
                <strong>Data:</strong>{" "}
                {new Date(order.date_created).toLocaleString()} <br />
                <strong>Total:</strong> R$ {order.total_amount?.toFixed(2)}{" "}
                <br />
                <strong>Comprador:</strong> {order.buyer} <br />
                <strong>Shipment ID:</strong>{" "}
                {order.shipping?.id || "Não disponível"}
              </div>

              {order.shipping?.id ? (
                <button
                  onClick={() => handlePrintClick(order.shipping.id)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#0070ba",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  🖨️ Imprimir Etiqueta
                </button>
              ) : (
                <span style={{ color: "#999", fontStyle: "italic" }}>
                  Sem etiqueta
                </span>
              )}
            </li>
          ))} */}
        </ul>
      )}
    </Layout>
  );
}
