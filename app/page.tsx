"use client";
import React, { useEffect, useState } from "react";

export default function Home() {

  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMonthlyTotal = async () => {
      try {
        const res = await fetch("/api/getMonthlyExpense");
        const data = await res.json();

        if (data.success) {
          setTotal(data.total);
        }
      } catch (error) {
        console.error("Failed to fetch monthly total", error);
      }
    };

    fetchMonthlyTotal();
  }, []);

  const categories = [
    "Category",
    "Self Care",
    "Travel",
    "Room Rent",
    "Buying Techs",
    "Food",
    "Clothing",
    "Trips",
    "Parties",
    "Miscellaneous"
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      description: formData.get("description"),
      category: formData.get("category"),
      value: formData.get("value"),
    }

    try {
      setLoading(true);
      const response = await fetch("/api/addExpense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success !== true) {
        alert("Error adding expense");
        return;
      }

      alert("Expense added successfully");
      form.reset();
    } catch (error) {
      console.log("Error adding expense", error);
      alert("Error adding expense");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>

      {/* Total Monthly Expense */}
      <div className="flex items-center justify-between mx-4 py-2 px-4 mb-6 mt-4 bg-white border border-dashed border-black/10 rounded-md">
        <p className="text-sm text-gray-500">
          Total Expense (This Month)
        </p>
        <p className="text-xl font-semibold">
          ₹{total.toLocaleString("en-IN")}
        </p>
      </div>

      {/* Add an expense form */}
      <div className='w-full h-[40vh] flex items-center justify-center p-4'>
        <form
          className='w-full flex flex-col rounded-sm border border-dashed border-black/10 bg-white p-2'
          onSubmit={(e) => handleSubmit(e)}>
          <h1 className='mb-4 text-center text-xl font-semibold tracking-tighter p-2'>Add an Expense</h1>
          <textarea
            name="description"
            placeholder='Enter the description'
            className='outline-none resize-none border border-black/10 rounded-sm mb-4 p-2'></textarea>
          <select
            name="category"
            className='border border-black/10 rounded-sm outline-none mb-4 p-2'
          >
            {categories.map((category) => (
              (
                <option
                  key={category}
                  value={`${category}`}
                  className='rounded-sm p-2'
                >
                  {category}
                </option>
              )
            ))}
          </select>
          <input
            type="text"
            placeholder='Enter the money spent'
            name='value'
            className='border border-black/10 rounded-sm outline-none mb-4 p-2'
          />
          <button
            type='submit'
            className='w-full bg-purple-600 text-white rounded-sm p-2'
          >
            {loading ? <span>Loading....</span> : <span>Add Expense</span>}
          </button>
        </form>
      </div>
    </div>
  );
}
