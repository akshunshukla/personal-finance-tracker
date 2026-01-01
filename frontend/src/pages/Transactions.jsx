import React, { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import TransactionModal from "../components/TransactionModal";

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        search,
        type: typeFilter,
      });

      const res = await api.get(`/transactions?${params.toString()}`);
      setTransactions(res.data.data);
    } catch (error) {
      console.error("Error fetching transactions", error);
    }
    setLoading(false);
  }, [page, search, typeFilter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await api.delete(`/transactions/${id}`);
        fetchTransactions();
      } catch (error) {
        alert("Failed to delete transaction");
      }
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const canEdit = user?.role === "admin" || user?.role === "user";

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-700">Transactions</h2>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Search Input */}
            <div className="relative">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Filter
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
              >
                <option value="">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            {/* Add Button */}
            {canEdit && (
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm ml-auto"
              >
                <Plus size={18} /> Add New
              </button>
            )}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600 text-sm uppercase">
                  Date
                </th>
                <th className="p-4 font-semibold text-gray-600 text-sm uppercase">
                  Category
                </th>
                <th className="p-4 font-semibold text-gray-600 text-sm uppercase">
                  Type
                </th>
                <th className="p-4 font-semibold text-gray-600 text-sm uppercase">
                  Amount
                </th>
                {canEdit && (
                  <th className="p-4 font-semibold text-gray-600 text-sm uppercase text-right">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-700">
                      {new Date(t.transaction_date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-gray-700 font-medium">
                      {t.category_name || "Uncategorized"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          t.type === "income"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {t.type.toUpperCase()}
                      </span>
                    </td>
                    <td
                      className={`p-4 font-bold ${
                        t.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"} ₹{t.amount}
                    </td>
                    {canEdit && (
                      <td className="p-4 text-right space-x-3">
                        <button
                          onClick={() => handleEdit(t)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="p-4 flex justify-between items-center border-t border-gray-100 bg-gray-50">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex items-center gap-1 px-3 py-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
            >
              <ChevronLeft size={18} /> Previous
            </button>
            <span className="text-sm font-medium text-gray-600">
              Page {page}
            </span>
            <button
              disabled={transactions.length < 10}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-1 px-3 py-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
            >
              Next <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchTransactions}
          transactionToEdit={editingTransaction}
        />
      </div>
    </div>
  );
};

export default Transactions;
