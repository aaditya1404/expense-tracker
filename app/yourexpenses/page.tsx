"use client";
import React, { useEffect, useState } from "react";
import AllExpenses, { Expense } from "@/components/AllExpenses";

const YourExpenses = () => {
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
      <AllExpenses expenses={expenses} setExpenses={setExpenses} />
    </div>
  );
};

export default YourExpenses;
