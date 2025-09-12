// components/Layout.js
import Link from "next/link";

export default function Layout({ children, activePage }) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <nav
        style={{
          backgroundColor: "#0070ba",
          padding: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: "18px", color: "white", fontWeight: "bold" }}>
          ML Auth App
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <Link href="/" style={linkStyle(activePage === "dashboard")}>
            🏠 Início
          </Link>
          <Link
            href="/admin/vendedores"
            style={linkStyle(activePage === "admin")}
          >
            👥 Vendedores
          </Link>
        </div>
      </nav>

      <main style={{ padding: "20px 40px" }}>{children}</main>
    </div>
  );
}

const linkStyle = (active) => ({
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
  borderBottom: active ? "2px solid white" : "none",
});
