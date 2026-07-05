// src/Dashboard.jsx
import { useState } from "react";
import { auth, signOut } from "./firebase/firebase";
import { useNavigate } from "react-router-dom";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Sample data for charts
  const growthData = [
    { month: "Jan", weight: 120, target: 100 },
    { month: "Feb", weight: 180, target: 200 },
    { month: "Mar", weight: 250, target: 300 },
    { month: "Apr", weight: 380, target: 400 },
    { month: "May", weight: 470, target: 500 },
    { month: "Jun", weight: 580, target: 600 },
  ];

  const waterQualityData = [
    { day: "Mon", pH: 7.2, temp: 26, oxygen: 6.5 },
    { day: "Tue", pH: 7.0, temp: 27, oxygen: 6.0 },
    { day: "Wed", pH: 7.4, temp: 25, oxygen: 7.0 },
    { day: "Thu", pH: 7.1, temp: 26, oxygen: 6.8 },
    { day: "Fri", pH: 7.3, temp: 24, oxygen: 7.2 },
    { day: "Sat", pH: 7.0, temp: 25, oxygen: 6.5 },
    { day: "Sun", pH: 7.2, temp: 26, oxygen: 7.0 },
  ];

  const feedData = [
    { name: "Tilapia", value: 45 },
    { name: "Catfish", value: 30 },
    { name: "Trout", value: 25 },
  ];

  const COLORS = ["#22c55e", "#3b82f6", "#f59e0b"];

  const recentActivities = [
    { id: 1, action: "Added 500 Tilapia fingerlings", pond: "Pond A", time: "2 hours ago", icon: "🐟" },
    { id: 2, action: "Water quality reading logged", pond: "Pond B", time: "4 hours ago", icon: "🌊" },
    { id: 3, action: "Feed 15kg pellets", pond: "Pond A", time: "6 hours ago", icon: "🍽️" },
    { id: 4, action: "Harvested 120kg", pond: "Pond C", time: "1 day ago", icon: "🎣" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ========== SIDEBAR ========== */}
      <aside className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-3xl">🐟</span>
            <span className="text-2xl font-bold text-green-700">Aora</span>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab("dashboard")}
              className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
                activeTab === "dashboard" 
                  ? "bg-green-50 text-green-700 font-medium" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>📊</span> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab("ponds")}
              className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
                activeTab === "ponds" 
                  ? "bg-green-50 text-green-700 font-medium" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>🏊</span> Ponds
            </button>
            <button 
              onClick={() => setActiveTab("harvesting")}
              className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
                activeTab === "harvesting" 
                  ? "bg-green-50 text-green-700 font-medium" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>🎣</span> Harvesting
            </button>
            <button 
              onClick={() => setActiveTab("finances")}
              className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
                activeTab === "finances" 
                  ? "bg-green-50 text-green-700 font-medium" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>💰</span> Finances
            </button>
            <button 
              onClick={() => setActiveTab("water")}
              className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
                activeTab === "water" 
                  ? "bg-green-50 text-green-700 font-medium" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>🌊</span> Water Quality
            </button>
            <button 
              onClick={() => setActiveTab("settings")}
              className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
                activeTab === "settings" 
                  ? "bg-green-50 text-green-700 font-medium" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>⚙️</span> Settings
            </button>
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={handleLogout}
              className="w-full bg-red-50 text-red-600 px-4 py-3 rounded-lg hover:bg-red-100 transition flex items-center gap-3"
            >
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome back! Here's your farm overview</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-100">
              <span className="text-sm text-gray-500">📅 {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
              👨‍🌾
            </div>
          </div>
        </div>

        {/* Search Bar (like in the image) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-gray-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search any content..." 
              className="flex-1 outline-none text-gray-600 placeholder-gray-400"
            />
          </div>
        </div>

        {/* ========== SUMMARY STATS CARDS ========== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Total Ponds</p>
              <span className="text-2xl">🏊</span>
            </div>
            <p className="text-3xl font-bold text-green-600">12</p>
            <p className="text-xs text-green-500 mt-1">↑ 2 new this month</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Total Fish</p>
              <span className="text-2xl">🐟</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">8,450</p>
            <p className="text-xs text-blue-500 mt-1">↑ 500 added this week</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Monthly Revenue</p>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-3xl font-bold text-yellow-600">KSh 142K</p>
            <p className="text-xs text-yellow-500 mt-1">↑ 12% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Feed Used (kg)</p>
              <span className="text-2xl">🍽️</span>
            </div>
            <p className="text-3xl font-bold text-purple-600">2,340</p>
            <p className="text-xs text-purple-500 mt-1">FCR: 1.8</p>
          </div>
        </div>

        {/* ========== CHARTS ROW ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Growth Chart (Main) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">📈 Fish Growth Performance</h3>
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-1">
                <option>This Year</option>
                <option>This Month</option>
                <option>Last 6 Months</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#22c55e" strokeWidth={2} name="Actual Weight (g)" />
                <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="Target Weight (g)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Water Quality Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-700 mb-4">🌊 Water Quality Today</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="text-gray-600">pH Level</span>
                <span className="font-medium text-green-600">7.2</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="text-gray-600">Temperature</span>
                <span className="font-medium text-blue-600">26°C</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="text-gray-600">Dissolved Oxygen</span>
                <span className="font-medium text-yellow-600">6.8 mg/L</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="text-gray-600">Ammonia</span>
                <span className="font-medium text-red-500">0.02 ppm</span>
              </div>
              <div className="mt-2 p-2 bg-green-50 rounded-lg text-center text-sm text-green-700">
                ✅ Water quality is optimal
              </div>
            </div>
          </div>
        </div>

        {/* ========== SECOND ROW ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feed Distribution Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-700 mb-4">📊 Feed Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={feedData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {feedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity / Logs */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-700 mb-4">🕐 Recent Activity</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 border-b border-gray-50 pb-3">
                  <span className="text-xl">{activity.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{activity.action}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{activity.pond}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Harvesting / Cost Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-700 mb-4">🎣 Harvesting Cost</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="text-gray-600">Tilapia</span>
                <span className="font-medium text-green-600">KSh 76K</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="text-gray-600">Catfish</span>
                <span className="font-medium text-blue-600">KSh 24K</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="text-gray-600">Trout</span>
                <span className="font-medium text-yellow-600">KSh 15K</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t-2 border-gray-200">
                <span className="font-bold text-gray-700">Total</span>
                <span className="font-bold text-green-700 text-lg">KSh 115K</span>
              </div>
              <div className="mt-2 p-2 bg-green-50 rounded-lg text-center text-sm text-green-700">
                📈 Up 8% from last cycle
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm mt-8 py-4 border-t border-gray-200">
          Aora Aquaculture Management System v1.0 
        </div>
      </main>
    </div>
  );
}

export default Dashboard;