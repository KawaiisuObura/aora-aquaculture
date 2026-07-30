// src/pages/AdminDashboard.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Layout } from "../components/Layout";
import { useAuth } from "../context/useAuth";
import { getAllUsers } from "../services/userService";
import {
  countActiveHarvests,
  getAllHarvests,
  getAllPonds,
  getAllTransactions,
  getRecentActivity,
  sumRevenue,
} from "../services/farmService";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const currency = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});

/**
 * Colour classes for a user account status badge.
 * @param {boolean} isActive Whether the account is active.
 * @returns {string} Tailwind classes.
 */
function getStatusColor(isActive) {
  return isActive === false ? "bg-gray-100 text-gray-600" : "bg-green-50 text-green-700";
}

/**
 * Convert a Firestore timestamp, Date or ISO string into a readable date.
 * @param {*} value Timestamp-like value.
 * @returns {string}
 */
function formatDate(value) {
  if (!value) return "—";
  const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("en-KE");
}

/**
 * Group transactions of the current year into monthly revenue and expenses.
 * @param {Object[]} transactions Transaction documents.
 * @returns {{ month: string, revenue: number, expenses: number }[]}
 */
function buildMonthlySeries(transactions) {
  const series = MONTHS.map((month) => ({ month, revenue: 0, expenses: 0 }));
  const year = new Date().getFullYear();

  transactions.forEach((entry) => {
    const raw = entry.date || entry.createdAt;
    if (!raw) return;
    const date = typeof raw.toDate === "function" ? raw.toDate() : new Date(raw);
    if (Number.isNaN(date.getTime()) || date.getFullYear() !== year) return;

    const bucket = series[date.getMonth()];
    const amount = Number(entry.amount) || 0;
    if (entry.type === "revenue") {
      bucket.revenue += amount;
    } else {
      bucket.expenses += amount;
    }
  });

  return series;
}

/**
 * Administrator overview of farmers, ponds, harvests and revenue.
 */
export function AdminDashboard() {
  const { user, userProfile } = useAuth();
  const [users, setUsers] = useState([]);
  const [ponds, setPonds] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activity, setActivity] = useState([]);
  const [stats, setStats] = useState({
    totalPonds: 0,
    totalFarmers: 0,
    totalRevenue: 0,
    activeHarvests: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [allUsers, allPonds, allHarvests, allTransactions, recentActivity] = await Promise.all([
        getAllUsers(),
        getAllPonds(),
        getAllHarvests(),
        getAllTransactions(),
        getRecentActivity(),
      ]);

      setUsers(allUsers);
      setPonds(allPonds);
      setTransactions(allTransactions);
      setActivity(recentActivity);
      setStats({
        totalPonds: allPonds.length,
        totalFarmers: allUsers.filter((entry) => entry.role !== "admin").length,
        totalRevenue: sumRevenue(allTransactions),
        activeHarvests: countActiveHarvests(allHarvests),
      });
    } catch {
      setError("Could not load dashboard data. Please try again.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const monthlySeries = useMemo(() => buildMonthlySeries(transactions), [transactions]);
  const recentTransactions = useMemo(() => transactions.slice(0, 5), [transactions]);
  const farmers = useMemo(() => users.filter((entry) => entry.role !== "admin"), [users]);

  const adminName = userProfile?.displayName || user?.email || "Admin";

  const statCards = [
    { label: "Total Revenue", value: currency.format(stats.totalRevenue), icon: "💰" },
    { label: "Total Ponds", value: stats.totalPonds, icon: "🏊" },
    { label: "Total Farmers", value: stats.totalFarmers, icon: "👨‍🌾" },
    { label: "Active Harvests", value: stats.activeHarvests, icon: "🎣" },
  ];

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-purple-800">Hello, {adminName}!!</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back again, let&apos;s get back to work.
        </p>
        <p className="inline-block mt-4 bg-purple-50 border border-purple-200 text-purple-800 text-sm px-4 py-2 rounded-lg">
          {new Date().toLocaleDateString("en-KE", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </header>

      {error && (
        <div role="alert" className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">{card.label}</p>
              <span className="text-2xl" aria-hidden="true">
                {card.icon}
              </span>
            </div>
            <p className="text-3xl font-bold text-purple-700">{loading ? "…" : card.value}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/admin/users"
          className="bg-purple-600 text-white px-6 py-4 rounded-xl hover:bg-purple-700 transition text-center font-medium"
        >
          👥 Manage Users
        </Link>
        <button
          type="button"
          disabled
          title="Reporting module not implemented yet"
          className="border-2 border-purple-200 text-purple-400 px-6 py-4 rounded-xl text-center font-medium cursor-not-allowed"
        >
          📄 Generate Report
        </button>
        <button
          type="button"
          disabled
          title="Settings module not implemented yet"
          className="border-2 border-purple-200 text-purple-400 px-6 py-4 rounded-xl text-center font-medium cursor-not-allowed"
        >
          ⚙️ Farm Settings
        </button>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-4">📊 Annual Profits</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlySeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => currency.format(value)} />
              <Bar dataKey="revenue" name="Revenue" fill="#7C3AED" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#DDD6FE" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-4">💳 Recent Transactions</h2>
          {recentTransactions.length === 0 ? (
            <p className="text-sm text-gray-400">No transactions recorded yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentTransactions.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center justify-between border-b border-gray-50 pb-2"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {entry.userName || entry.description || "Transaction"}
                    </p>
                    <p className="text-xs text-gray-400">{entry.type || "expense"}</p>
                  </div>
                  <span
                    className={
                      entry.type === "revenue"
                        ? "text-sm font-medium text-green-600"
                        : "text-sm font-medium text-red-600"
                    }
                  >
                    {currency.format(Number(entry.amount) || 0)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 overflow-x-auto">
        <h2 className="font-semibold text-gray-700 mb-4">🕐 Client Activity</h2>
        {activity.length === 0 ? (
          <p className="text-sm text-gray-400">No activity has been logged yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="py-2">#NO.</th>
                <th className="py-2">DATE &amp; TIME</th>
                <th className="py-2">ACTIVITY BY</th>
                <th className="py-2">ACTIVITY TYPE</th>
                <th className="py-2">REMARKS</th>
              </tr>
            </thead>
            <tbody>
              {activity.map((entry, index) => (
                <tr key={entry.id} className="border-b border-gray-50">
                  <td className="py-2 text-gray-500">{index + 1}</td>
                  <td className="py-2 text-gray-600">{formatDate(entry.createdAt)}</td>
                  <td className="py-2 text-gray-700">{entry.userName || entry.userId || "—"}</td>
                  <td className="py-2 text-gray-700">{entry.type || "—"}</td>
                  <td className="py-2 text-gray-500">{entry.remarks || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-700">👨‍🌾 Farmers</h2>
          <Link to="/admin/users" className="text-sm text-purple-600 hover:text-purple-700">
            View all
          </Link>
        </div>
        {loading ? (
          <p className="text-sm text-gray-400">Loading farmers…</p>
        ) : farmers.length === 0 ? (
          <p className="text-sm text-gray-400">No farmers registered yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Ponds</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {farmers.slice(0, 5).map((farmer) => (
                <tr key={farmer.id} className="border-b border-gray-50">
                  <td className="py-2 text-gray-700">{farmer.displayName || "—"}</td>
                  <td className="py-2 text-gray-600">{farmer.email || "—"}</td>
                  <td className="py-2 text-gray-600">
                    {ponds.filter((pond) => pond.ownerId === farmer.uid).length}
                  </td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(farmer.isActive)}`}
                    >
                      {farmer.isActive === false ? "Inactive" : "Active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </Layout>
  );
}
