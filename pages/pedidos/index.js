// pages/pedidos/index.js
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function PedidosPage() {
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carregar vendedores
  useEffect(() => {
    fetch("/api/auth/sellers")
      .then((r) => r.json())
      .then((data) => {
        setSellers(data);
        if (data.length > 0) setSelectedSeller(data[0].user_id);
      });
  }, []);

  // Carregar pedidos
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
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      console.error("Erro ao carregar pedidos", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Função para gerar URL da prévia da etiqueta
  const getLabelaryUrl = (shipmentId) => {
    return `/zpl?shipment_id=${shipmentId}`;
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
      ) : orders.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {orders.map((order) => (
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
                <a
                  href={`/zpl?shipment_id=${order.shipping.id}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#0070ba",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "4px",
                    fontWeight: "bold",
                  }}
                >
                  🖨️ Imprimir
                </a>
              ) : (
                <span style={{ color: "#999" }}>Sem etiqueta</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
// // pages/pedidos/index.js
// import { useEffect, useState } from "react";

// export default function PedidosPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function load() {
//       try {
//         const res = await fetch("/api/orders?seller_id=1457023373");
//         const data = await res.json();
//         // Garanta que é array
//         setOrders(Array.isArray(data.orders) ? data.orders : []);
//       } catch (err) {
//         console.error(err);
//         setOrders([]);
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, []);

//   if (loading) return <p>Carregando...</p>;

//   return (
//     <div>
//       <h1>Pedidos</h1>
//       {(orders || []).length === 0 ? (
//         <p>Nenhum pedido encontrado</p>
//       ) : (
//         (orders || []).map((order) => (
//           <div key={order.id}>
//             <p>Pedido: {order.id}</p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }
