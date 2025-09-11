// pages/zpl/index.js
import { useState } from "react";
import Layout from "@/components/Layout";
import { getLabelaryUrl } from "@/utils/labelary";

export default function ZPLPage() {
  const [shipmentId, setShipmentId] = useState("");
  const [zpl, setZpl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    if (!shipmentId) return;
    setLoading(true);
    setError("");
    setZpl("");

    try {
      const res = await fetch(`/api/zpl?shipment_id=${shipmentId}`);
      const data = await res.json();

      if (res.ok) {
        setZpl(data.zpl);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Falha ao conectar ao servidor");
    } finally {
      setLoading(false);
    }
  };

  // const getLabelaryUrl = (zplCode) => {
  //   const encoded = encodeURIComponent(zplCode.trim());
  //   return `https://www.labelary.com/viewer.html?p=1&d=8&s=2&w=4&h=6&f=hex&file=${encoded}`;
  // };

  return (
    <Layout>
      <h1>🖨️ Impressão de Etiquetas ZPL</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Ex: 1234567890"
          value={shipmentId}
          onChange={(e) => setShipmentId(e.target.value)}
          style={{ padding: "10px", fontSize: "16px", width: "300px" }}
        />
        <button
          onClick={handleDownload}
          disabled={loading}
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#0070ba",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {loading ? "Baixando..." : "Baixar ZPL"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>❌ {error}</p>}

      {zpl && (
        <div>
          <h3>✅ Etiqueta carregada!</h3>
          <a
            href={getLabelaryUrl(zpl)}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              marginTop: "10px",
            }}
          >
            👁️ Ver Prévia no Labelary
          </a>
        </div>
      )}
    </Layout>
  );
}
