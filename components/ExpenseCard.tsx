"use client";
import React, { useState } from "react";

interface Expense {
  description: string,
  category: string,
  value: string,
  createdAt: string,
  _id: string
}

interface ExpenseCardProps {
    expense: Expense;
    onDelete: (id: string) => void;
}

const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);

    const time = date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    const formattedDate = date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    return `${time} | ${formattedDate}`;
};

const ExpenseCard = ({ expense, onDelete }: ExpenseCardProps) => {

    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        onDelete(expense._id);
        setShowConfirm(false);
    };

    return (
        <div className="w-full bg-white border border-dashed border-black/10 rounded-sm mb-2 p-2">
            <div className="flex items-center justify-between">
                <h1 className="font-semibold max-w-[70%]">{expense.description}</h1>
                <h3 className="">₹{expense.value}</h3>
            </div>
            <div>
                <h2 className="text-sm text-black/80">{expense.category}</h2>
                <h4 className="text-sm text-black/80">{formatDateTime(expense.createdAt)}</h4>
            </div>
            <button
                onClick={() => setShowConfirm(true)}
                className="text-sm text-red-600 hover:underline"
            >
                Delete
            </button>

            {showConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-md w-[90%] max-w-sm">
                        <h3 className="font-semibold text-lg mb-2">
                            Delete Expense?
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Are you sure you want to delete this expense? This action
                            cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-3 py-1 text-sm border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-3 py-1 text-sm bg-red-600 text-white rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpenseCard;
