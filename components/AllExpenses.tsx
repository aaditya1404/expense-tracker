"use client";
import React, { useEffect, useState } from 'react'
import ExpenseCard from './ExpenseCard';

export interface Expense {
    description: string,
    category: string,
    value: string,
    createdAt: string,
    _id: string
}

interface Props {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}

const AllExpenses = ({ expenses, setExpenses }: Props) => {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await fetch("/api/getAllExpense", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = await response.json();
                setExpenses(data.response);
            } catch (error) {
                console.log("Error fetching expenses", error);
            } finally {
                setLoading(false);
            }
        }
        fetchExpenses();
    }, []);

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

    if (loading) {
        return <p>Loading expenses...</p>;
    }

    return (
        <div className='p-4'>
            {expenses.map((expense) => (
                <ExpenseCard key={expense._id} expense={expense} onDelete={handleDeleteExpense}/>
            ))}
        </div>
    )
}

export default AllExpenses
