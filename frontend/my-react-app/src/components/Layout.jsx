import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

export default Layout;
