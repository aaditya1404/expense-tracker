"use client";
import React, { useMemo } from "react";

interface Expense {
  value: string;
  createdAt: string;
}

interface Props {
  expenses: Expense[];
}

const TotalExpense = ({ expenses }: Props) => {

  const total = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses
      .filter(exp => {
        const date = new Date(exp.createdAt);
        return (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );
      })
      .reduce((sum, exp) => sum + Number(exp.value), 0);
  }, [expenses]);

  return (
    <div className="flex items-center justify-between mx-4 py-2 px-4 mb-6 mt-4 bg-white border border-dashed border-black/10 rounded-md">
      <p className="text-sm text-gray-500">
        Total Expense (This Month)
      </p>
      <p className="text-xl font-semibold">
        ₹{total.toLocaleString("en-IN")}
      </p>
    </div>
  );
};

export default TotalExpense;
