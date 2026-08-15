// src/AdminLogin.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, signInWithEmailAndPassword, signOut } from "./firebase/firebase";
import { getUserProfile } from "./services/userService";

/**
 * Login page for system administrators. Non-admin accounts are signed back out
 * and shown an access denied message.
 */
function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const profile = await getUserProfile(credential.user.uid);

      if (profile?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        await signOut(auth);
        setError("Access denied. This account does not have administrator rights.");
      }
    } catch (err) {
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        setError("No administrator account matches those details.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else {
        setError(err.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-purple-200">
        <div className="text-center mb-6">
          <span className="text-5xl block mb-2" aria-hidden="true">
            👑
          </span>
          <h1 className="text-3xl font-bold text-purple-800">Admin Portal</h1>
          <p className="text-gray-500 text-sm mt-1">Aora Farm Management System</p>
        </div>

        {error && (
          <div role="alert" className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="admin-email" className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              id="admin-email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="admin-password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
            Not an admin? Farmer login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
