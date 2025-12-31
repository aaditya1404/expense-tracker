"use client";
import React, { useEffect, useState } from "react";
import TotalExpense from "@/components/TotalExpense";
import AddExpenseForm from "@/components/AddExpenseForm";
import { Expense } from "@/components/AllExpenses";

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const res = await fetch("/api/getAllExpense");
      const data = await res.json();
      setExpenses(data.response || []);
    };
    fetchExpenses();
  }, []);

  return (
    <div>
      {/* ✅ Total Expense */}
      <TotalExpense expenses={expenses} />

      {/* ✅ Add Expense Form */}
      <AddExpenseForm />
    </div>
  );
}
