export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 32px",
        background: "#0a1a33",
        color: "#f5f1e8",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 480 }}>
        <h1 style={{ fontSize: 40, marginBottom: 16 }}>Page Not Found</h1>
        <p style={{ opacity: 0.7, marginBottom: 24 }}>
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <a
          href="/"
          style={{
            display: "inline-block",
            background: "#c9a24b",
            color: "#0a1a33",
            padding: "12px 28px",
            borderRadius: 4,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Back Home
        </a>
      </div>
    </main>
  );
}
