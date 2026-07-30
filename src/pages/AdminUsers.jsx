// src/pages/AdminUsers.jsx
import { useCallback, useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { auth } from "../firebase/firebase";
import { deleteUser, getAllUsers, updateUserRole } from "../services/userService";

/**
 * User management page: list every registered user, change roles and remove
 * user profiles.
 */
export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      setUsers(await getAllUsers());
      setError("");
    } catch {
      setError("Could not load users. Check your admin permissions.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const closeModal = useCallback(() => {
    setShowRoleModal(false);
    setSelectedUser(null);
  }, []);

  const handleRoleChange = useCallback(
    async (role) => {
      if (!selectedUser) return;
      setError("");
      setSuccess("");
      try {
        await updateUserRole(selectedUser.uid || selectedUser.id, role);
        setSuccess(`${selectedUser.displayName || selectedUser.email} is now a ${role}.`);
        closeModal();
        await fetchUsers();
      } catch {
        setError("Could not update the user role. Please try again.");
      }
    },
    [selectedUser, closeModal, fetchUsers]
  );

  const handleDeleteUser = useCallback(
    async (user) => {
      setError("");
      setSuccess("");

      if (user.uid === auth.currentUser?.uid) {
        setError("You cannot delete your own account.");
        return;
      }

      if (!window.confirm(`Delete ${user.displayName || user.email}? This cannot be undone.`)) {
        return;
      }

      try {
        await deleteUser(user.uid || user.id);
        setSuccess("User profile deleted.");
        await fetchUsers();
      } catch {
        setError("Could not delete the user. Please try again.");
      }
    },
    [fetchUsers]
  );

  return (
    <Layout>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-purple-800">Manage Users</h1>
        <p className="text-gray-500 text-sm mt-1">
          View every registered account, change roles and remove users.
        </p>
      </header>

      {success && (
        <div role="status" className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-4">
          {success}
        </div>
      )}
      {error && (
        <div role="alert" className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="p-4 text-gray-400">
                  Loading users…
                </td>
              </tr>
            )}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
            {!loading &&
              users.map((user) => (
                <tr key={user.id} className="border-b border-gray-50">
                  <td className="p-4 text-gray-700">{user.displayName || "—"}</td>
                  <td className="p-4 text-gray-600">{user.email || "—"}</td>
                  <td className="p-4 text-gray-600">{user.phoneNumber || "—"}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.role === "admin"
                          ? "bg-purple-50 text-purple-800"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {user.role === "admin" ? "Admin" : "Farmer"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.isActive === false
                          ? "bg-gray-100 text-gray-600"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {user.isActive === false ? "Inactive" : "Active"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowRoleModal(true);
                        }}
                        className="border-2 border-purple-600 text-purple-600 px-3 py-1 rounded-lg hover:bg-purple-50 transition"
                      >
                        Edit role
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user)}
                        disabled={user.uid === auth.currentUser?.uid}
                        className="border-2 border-red-600 text-red-600 px-3 py-1 rounded-lg hover:bg-red-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Change user role"
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
          >
            <h2 className="text-lg font-semibold text-purple-800 mb-1">Change role</h2>
            <p className="text-sm text-gray-500 mb-4">
              {selectedUser.displayName || selectedUser.email}
            </p>

            <div className="space-y-2">
              {["farmer", "admin"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleChange(role)}
                  className={`w-full px-4 py-3 rounded-lg text-left transition ${
                    selectedUser.role === role
                      ? "bg-purple-50 text-purple-700 font-medium"
                      : "hover:bg-purple-50 text-gray-700"
                  }`}
                >
                  {role === "admin" ? "👑 Admin" : "👨‍🌾 Farmer"}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={closeModal}
              className="w-full mt-4 text-gray-500 text-sm hover:text-purple-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
