export default function AboutLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      {/* <aside style={{ width: 200 }}>About</aside> */}
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
