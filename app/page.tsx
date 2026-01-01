"use client";
import React, { useEffect, useState } from "react";

export default function Home() {

  const [total, setTotal] = useState<number>(0);
  const [todayTotal, setTodayTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [valueInput, setValueInput] = useState("");
  const [computedValue, setComputedValue] = useState<number>(0);

  function toISTDate(dateString: string) {
    return new Date(
      new Date(dateString).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      })
    );
  }

  const fetchTotals = async () => {
    try {
      const res = await fetch("/api/getCurrentMonthExpenses", {
        cache: "no-store",
      });
      const data = await res.json();

      if (!data.success) return;

      const expenses = data.expenses;

      const istNow = toISTDate(new Date().toISOString());
      const todayY = istNow.getFullYear();
      const todayM = istNow.getMonth();
      const todayD = istNow.getDate();

      let todaySum = 0;
      let monthSum = 0;

      for (const exp of expenses) {
        const istDate = toISTDate(exp.createdAt);
        const amount = Number(exp.value) || 0;

        // monthly
        monthSum += amount;

        // today
        if (
          istDate.getFullYear() === todayY &&
          istDate.getMonth() === todayM &&
          istDate.getDate() === todayD
        ) {
          todaySum += amount;
        }
      }

      setTodayTotal(todaySum);
      setTotal(monthSum);
    } catch (error) {
      console.error("Failed to fetch totals", error);
    }
  };

  useEffect(() => {
    fetchTotals();
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

  function parseAndSumValues(input: string): number {
    return input
      .trim()
      .split(/\s+/)          // split by one or more spaces
      .map(v => Number(v))   // convert to number
      .filter(v => !isNaN(v))
      .reduce((sum, v) => sum + v, 0);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (computedValue <= 0) {
      alert("Please enter valid numbers separated by spaces");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      description: formData.get("description"),
      category: formData.get("category"),
      // value: formData.get("value"),
      value: String(computedValue),
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

      await fetchTotals();

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
      <div className="mx-4 mt-4 bg-white border border-dashed border-black/10 rounded-md">
        {/* Daily Expense */}
        <div className="flex items-center justify-between mx-4 py-2 px-4">
          <p className="text-sm text-gray-500">
            Total Expense (Today)
          </p>
          <p className="text-xl font-semibold">
            ₹{todayTotal.toLocaleString("en-IN")}
          </p>
        </div>
        {/* Total Monthly Expense */}
        <div className="flex items-center justify-between mx-4 py-2 px-4 border-t border-black/10">
          <p className="text-sm text-gray-500">
            Total Expense (This Month)
          </p>
          <p className="text-xl font-semibold">
            ₹{total.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Add an expense form */}
      <div className='w-full flex items-center justify-center p-4'>
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
          {/* <input
            type="text"
            placeholder='Enter the money spent'
            name='value'
            className='border border-black/10 rounded-sm outline-none mb-4 p-2'
          /> */}
          <textarea
            name="value"
            placeholder="Enter multiple amounts separated by space (e.g. 100 250 75)"
            className="outline-none resize-none border border-black/10 rounded-sm mb-2 p-2"
            value={valueInput}
            onChange={(e) => {
              const input = e.target.value;
              setValueInput(input);
              setComputedValue(parseAndSumValues(input));
            }}
          />

          <p className="text-md text-gray-800 mb-4">
            Total Value: <span className="font-semibold">₹{computedValue}</span>
          </p>

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
