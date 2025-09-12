// components/Layout.js
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <nav
        style={{
          backgroundColor: "#0070ba",
          padding: "15px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", gap: "20px", fontSize: "16px" }}>
          <Link href="/" style={linkStyle}>
            🏠 Início
          </Link>
          <Link href="/zpl" style={linkStyle}>
            🖨️ Etiquetas ZPL
          </Link>
          <Link href="/pedidos" style={linkStyle}>
            📦 Pedidos
          </Link>
          <a
            href="/api/auth/login"
            style={{ ...linkStyle, marginLeft: "auto" }}
          >
            ➕ Conectar Vendedor
          </a>
        </div>
      </nav>

      <main style={{ padding: "0 40px" }}>{children}</main>
    </div>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
};
