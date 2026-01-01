"use client";
import React, { useEffect, useRef, useState } from "react";
import { Expense } from "@/components/AllExpenses";
import ExpenseCard from "@/components/ExpenseCard";

const LIMIT = 10;

const YourExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    setExpenses([]);
    setPage(1);
    setHasMore(true);
  }, []);

  const fetchExpenses = async () => {
    if (isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;
    setLoading(true);

    try {
      const response = await fetch(
        `/api/getAllExpense?page=${page}&limit=${LIMIT}`,
        { cache: "no-store" }
      );

      const data = await response.json();

      if (data.success) {
        setExpenses(prev => [...prev, ...data.expenses]);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.log("Error fetching expenses", error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  // Initial load
  useEffect(() => {
    fetchExpenses();
  }, [page]);

  // Intersection Observer
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(prev => prev + 1);
      }
    });

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading]);


  const handleDeleteExpense = async (id: string) => {
    try {
      const res = await fetch(`/api/deleteExpense/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setExpenses(prev =>
          prev.filter(expense => expense._id !== id)
        );
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };


  return (
    <div>
      <div className='p-4'>
        {expenses.map((expense) => (
          <ExpenseCard key={expense._id} expense={expense} onDelete={handleDeleteExpense} />
        ))}

        {loading && (
          <p className="text-center text-gray-500 mt-4">
            Loading...
          </p>
        )}

        {!hasMore && (
          <p className="text-center text-gray-400 mt-4">
            No more expenses
          </p>
        )}

        <div ref={observerRef} className="h-1" />
      </div>
    </div>
  );
};

export default YourExpenses;
