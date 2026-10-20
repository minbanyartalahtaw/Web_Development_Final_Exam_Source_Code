//src/components/Layout.jsx

import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-5xl p-6">{children}</main>
    </div>
  );
}
