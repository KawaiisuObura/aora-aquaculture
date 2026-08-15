// src/components/Layout.jsx
import { Sidebar } from "./Sidebar";

/**
 * Page shell with the navigation sidebar.
 * @param {{ children: React.ReactNode }} props
 */
export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
