function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8f9fb",
      }}
    >
      <h1
        style={{
          fontSize: "80px",
          margin: 0,
          color: "#ff6b6b",
        }}
      >
        404
      </h1>

      <h2>Page Not Found</h2>

      <p>
        The page you are looking for does not exist.
      </p>
    </div>
  );
}

export default NotFound;