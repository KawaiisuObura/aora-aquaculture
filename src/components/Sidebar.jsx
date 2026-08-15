// src/components/Sidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, signOut } from "../firebase/firebase";
import { useAuth } from "../context/useAuth";

const baseNavItems = [{ path: "/dashboard", icon: "📊", label: "Dashboard" }];

const adminNavItems = [
  { path: "/admin/dashboard", icon: "👑", label: "Admin Dashboard" },
  { path: "/admin/users", icon: "👥", label: "Manage Users" },
];

/**
 * Navigation sidebar. Admin destinations are appended for admin users and use
 * the purple admin accent so they are visually distinct from farmer links.
 */
export function Sidebar() {
  const { isAdmin } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const navItems = isAdmin ? [...baseNavItems, ...adminNavItems] : baseNavItems;

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-3xl">🐟</span>
          <span className="text-2xl font-bold text-green-700">Aora</span>
        </div>

        <nav className="space-y-2" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const isAdminLink = item.path.startsWith("/admin");

            let styles = "text-gray-600 hover:bg-gray-50";
            if (isActive && isAdminLink) {
              styles = "bg-purple-50 text-purple-700 font-medium";
            } else if (isActive) {
              styles = "bg-green-50 text-green-700 font-medium";
            } else if (isAdminLink) {
              styles = "text-purple-600 hover:bg-purple-50";
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive ? "page" : undefined}
                className={`w-full px-4 py-3 rounded-lg transition flex items-center gap-3 ${styles}`}
              >
                <span aria-hidden="true">{item.icon}</span> {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-600 px-4 py-3 rounded-lg hover:bg-red-100 transition flex items-center gap-3"
        >
          <span aria-hidden="true">🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}
