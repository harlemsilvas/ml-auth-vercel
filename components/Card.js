export default function Card({ title, children, style }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        backgroundColor: "#fff",
        ...style,
      }}
    >
      <h3 style={{ marginBottom: "15px", color: "#2C2C2C" }}>{title}</h3>
      {children}
    </div>
  );
}
