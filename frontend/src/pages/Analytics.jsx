import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { RefreshCcw } from "lucide-react";
import api from "../services/api";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#6366F1",
];

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get("/analytics/summary");
      console.log("Analytics Data Fetched:", res.data.data);
      setData(res.data.data);
    } catch (error) {
      console.error("Failed to fetch analytics", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading Analytics...</p>
      </div>
    );
  }

  const rawPieData = data?.categoryBreakdown || [];

  const pieData =
    rawPieData.length > 0
      ? rawPieData.map((item) => ({
          name: item.category || item.name || "Unknown",
          value: Number(item.total || item.value || 0),
        }))
      : [{ name: "No Data", value: 1 }];

  const rawLineData = data?.monthlyTrends || [];

  const lineData = rawLineData.map((item) => ({
    month: item.month,
    income: Number(item.total_income || 0),
    expense: Number(item.total_expense || 0),
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header & Refresh Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-700">
            Analytics Dashboard
          </h2>
          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors bg-white px-3 py-1.5 rounded border border-blue-100 shadow-sm"
          >
            <RefreshCcw size={16} /> Refresh Data
          </button>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Income Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">
              Total Income
            </p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              ₹ {Number(data?.totalIncome || 0).toLocaleString()}
            </p>
          </div>

          {/* Expense Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">
              Total Expense
            </p>
            <p className="text-2xl font-bold text-red-500 mt-2">
              ₹ {Number(data?.totalExpense || 0).toLocaleString()}
            </p>
          </div>

          {/* Balance Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">
              Net Balance
            </p>
            <p
              className={`text-2xl font-bold mt-2 ${
                data?.netBalance >= 0 ? "text-blue-600" : "text-red-600"
              }`}
            >
              ₹ {Number(data?.netBalance || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Pie Chart: Expense by Category */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-100">
            <h3 className="text-gray-700 font-semibold mb-6">
              Expense Breakdown
            </h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.name === "No Data"
                            ? "#E5E7EB"
                            : COLORS[index % COLORS.length]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `₹ ${Number(value).toLocaleString()}`}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart: Monthly Trends */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-100">
            <h3 className="text-gray-700 font-semibold mb-6">
              Income vs Expense Trends
            </h3>
            <div className="flex-1 w-full min-h-0">
              {lineData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={lineData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip
                      formatter={(value) =>
                        `₹ ${Number(value).toLocaleString()}`
                      }
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                      name="Income"
                    />
                    <Line
                      type="monotone"
                      dataKey="expense"
                      stroke="#EF4444"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                      name="Expense"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <p>No transaction history available.</p>
                  <p className="text-xs mt-2">
                    Add transactions to see trends.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
