import Navbar from "./Navbar";

// Layout is the frame around every logged-in page.
// It draws the navbar on top, then the page content below it.
// "children" is whatever page we put inside it.
function Layout({ children }) {
  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

export default Layout;
