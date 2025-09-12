// pages/index.js
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function Home() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      // Carrega dados do vendedor atual
      const userRes = await fetch("/api/auth/current-token");
      if (!userRes.ok) throw new Error("Não autenticado");
      const userData = await userRes.json();
      setUser(userData);
      const userInfo = await fetch(`/api/users/${userData.user_id}`).then((r) =>
        r.json()
      );
      setUser({ ...userData, nickname: userInfo.nickname });

      // Carrega pedidos
      const ordersRes = await fetch(
        `/api/orders?seller_id=${userData.user_id}`
      );
      const ordersData = await ordersRes.json();
      setOrders(ordersData.orders || []);
    } catch (err) {
      console.error(err);
      window.location.href = "/api/auth/login";
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (shipmentId) => {
    window.open(`/zpl?shipment_id=${shipmentId}`, "_blank");
  };

  return (
    <Layout activePage="dashboard">
      <h1>🏠 Painel do Vendedor</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          {user && (
            <Card title="Informações do Vendedor">
              <p>
                <strong>Nickname:</strong> {user.nickname}
              </p>
              <p>
                <strong>ID:</strong> {user.user_id}
              </p>
              <p>
                <strong>Status:</strong> Conectado
              </p>
            </Card>
          )}

          <Card title="Pedidos Recentes" style={{ marginTop: "20px" }}>
            {orders.length === 0 ? (
              <p>Nenhum pedido pronto para envio.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {orders.map((order) => (
                  <li
                    key={order.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <div>
                      <strong>Pedido:</strong> {order.id} |
                      <strong> Comprador:</strong> {order.buyer} |
                      <strong> Valor:</strong> R${" "}
                      {order.total_amount?.toFixed(2)}
                      <br />
                      <small>
                        <strong>Data:</strong>{" "}
                        {new Date(order.date_created).toLocaleString()}
                      </small>
                    </div>
                    {order.shipping?.id && (
                      <Button onClick={() => handlePrint(order.shipping.id)}>
                        🖨️ Imprimir Etiqueta
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </Layout>
  );
}
