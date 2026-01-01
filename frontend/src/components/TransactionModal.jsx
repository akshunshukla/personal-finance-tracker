import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import Input from "./Input";
import Button from "./Button";
import api from "../services/api";

const TransactionModal = ({
  isOpen,
  onClose,
  onSuccess,
  transactionToEdit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = React.useState(false);
  const [categories, setCategories] = React.useState([]);

  // 1. Fetch categories
  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const res = await api.get("/categories");
          setCategories(res.data.data);
        } catch (error) {
          console.error("Failed to fetch categories");
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (transactionToEdit) {
      setValue("type", transactionToEdit.type);
      setValue("amount", transactionToEdit.amount);
      setValue("category", transactionToEdit.category);

      const dateStr = new Date(transactionToEdit.transaction_date)
        .toISOString()
        .split("T")[0];
      setValue("transactionDate", dateStr);
    } else {
      reset({ type: "expense" });
    }
  }, [transactionToEdit, isOpen, reset, setValue]);

  const currentType = watch("type") || "expense";
  const filteredCategories = categories.filter(
    (cat) => cat.type === currentType
  );

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (transactionToEdit) {
        await api.put(`/transactions/${transactionToEdit.id}`, data);
      } else {
        await api.post("/transactions", data);
      }
      onSuccess();
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save transaction");
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {transactionToEdit ? "Edit Transaction" : "New Transaction"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              {...register("type", { required: true })}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          {/* Amount */}
          <Input
            label="Amount"
            type="number"
            placeholder="0.00"
            {...register("amount", { required: "Amount is required", min: 0 })}
            error={errors.amount}
          />

          {/* Category Dropdown*/}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              {...register("category", { required: "Category is required" })}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Category</option>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No categories found for {currentType}
                </option>
              )}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          <Input
            label="Date"
            type="date"
            {...register("transactionDate", { required: "Date is required" })}
            error={errors.transactionDate}
          />

          <Button type="submit" isLoading={loading}>
            {transactionToEdit ? "Update Transaction" : "Add Transaction"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
