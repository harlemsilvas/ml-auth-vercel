// pages/zpl/index.js
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
// import { getLabelaryUrl } from "@/utils/labelary";

export default function ZPLPage() {
  const [zpl, setZpl] = useState("");
  const [shipmentId, setShipmentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("shipment_id");
    if (!id) {
      setError("Shipment ID não fornecido.");
      setLoading(false);
      return;
    }

    setShipmentId(id);
    fetchZPL(id);
  }, []);

  const fetchZPL = async (id) => {
    try {
      const res = await fetch(`/api/zpl?shipment_id=${id}`);
      const data = await res.json();

      if (res.ok && data.zpl) {
        setZpl(data.zpl);
      } else {
        setError(data.error || "Falha ao baixar ZPL");
      }
    } catch (err) {
      setError("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const getLabelaryUrl = () => {
    const encodedZpl = encodeURIComponent(zpl.trim());
    return `https://www.labelary.com/viewer.html?p=1&d=8&s=2&w=4&h=6&f=hex&file=${encodedZpl}`;
  };

  if (loading)
    return (
      <Layout>
        <p>Carregando etiqueta...</p>
      </Layout>
    );
  if (error)
    return (
      <Layout>
        <p style={{ color: "red" }}>❌ {error}</p>
      </Layout>
    );

  return (
    <Layout>
      <h1>🖨️ Prévia da Etiqueta ZPL</h1>
      <p>
        <strong>Shipment ID:</strong> {shipmentId}
      </p>

      <a
        href={getLabelaryUrl()}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "inline-block",
          padding: "12px 24px",
          backgroundColor: "#28a745",
          color: "white",
          textDecoration: "none",
          borderRadius: "4px",
          fontWeight: "bold",
          marginTop: "20px",
        }}
      >
        👁️ Ver Prévia no Labelary
      </a>

      <div
        style={{
          marginTop: "30px",
          whiteSpace: "pre-wrap",
          fontFamily: "monospace",
          fontSize: "12px",
          background: "#f5f5f5",
          padding: "10px",
          borderRadius: "4px",
        }}
      >
        {zpl}
      </div>
    </Layout>
  );
}
