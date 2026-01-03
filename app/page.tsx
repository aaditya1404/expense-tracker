"use client";
import React, { useEffect, useState } from "react";

interface Expense {
  description: string,
  category: string,
  value: string,
  createdAt: string,
  _id: string
}

export default function Home() {

  const [total, setTotal] = useState<number>(0);
  const [todayTotal, setTodayTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [valueInput, setValueInput] = useState("");
  const [computedValue, setComputedValue] = useState<number>(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState<Expense[]>([]);
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const [balanceInput, setBalanceInput] = useState("");
  const [isEditingBalance, setIsEditingBalance] = useState(true);

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
      setMonthlyExpenses(expenses);

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

  const fetchBalance = async () => {
    const res = await fetch("/api/getBalance", { cache: "no-store" });
    const data = await res.json();

    if (data.success) {
      setAvailableBalance(data.amount);
      if (data.amount > 0) {
        setIsEditingBalance(false);
      }
    }
  };

  useEffect(() => {
    fetchTotals();
    fetchBalance();
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

  function getCategoryWiseTotal(expenses: Expense[]) {
    const categoryMap: Record<string, number> = {};

    for (const exp of expenses) {
      const category = exp.category;
      const amount = Number(exp.value) || 0;

      if (categoryMap[category]) {
        categoryMap[category] += amount;
      } else {
        categoryMap[category] = amount;
      }
    }

    return categoryMap;
  }
  async function handleBalanceSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const amount = Number(balanceInput);
    if (amount <= 0) {
      alert("Enter valid balance");
      return;
    }

    const res = await fetch("/api/setBalance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const data = await res.json();

    if (data.success) {
      setAvailableBalance(data.amount);
      setBalanceInput("");
      setIsEditingBalance(false);
    }
  }

  function handleEditBalance() {
    setBalanceInput(String(availableBalance));
    setIsEditingBalance(true);
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
      await fetchBalance();
      alert("Expense added successfully");
      setValueInput("");
      setComputedValue(0);
      form.reset();
    } catch (error) {
      console.log("Error adding expense", error);
      alert("Error adding expense");
    } finally {
      setLoading(false);
    }
  }

  const categoryTotals = getCategoryWiseTotal(monthlyExpenses);

  return (
    <div className="mx-4">
      {/* Daily and Monthly expense */}
      <div className="mb-4 mt-4 bg-white border border-dashed border-black/10 rounded-md">
        {/* Daily Expense */}
        <div className="flex items-center justify-between mx-4 py-2">
          <p className="text-md text-gray-500">
            Total Expense (Today)
          </p>
          <p className="text-xl font-semibold">
            ₹{todayTotal.toLocaleString("en-IN")}
          </p>
        </div>
        {/* Total Monthly Expense */}
        <div className="flex items-center justify-between mx-4 py-2 border-t border-black/10">
          <p className="text-md text-gray-500">
            Total Expense (This Month)
          </p>
          <p className="text-xl font-semibold">
            ₹{total.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
      {/* Available Balance */}
      <div className="w-full mb-4">
        <div className="w-full flex items-center justify-between rounded-md border border-dashed border-black/10 bg-white p-3">

          {isEditingBalance ? (
            <form
              onSubmit={handleBalanceSubmit}
              className="flex w-full gap-2"
            >
              <input
                type="number"
                placeholder="Enter available balance"
                value={balanceInput}
                onChange={(e) => setBalanceInput(e.target.value)}
                className="flex-1 outline-none border border-black/10 rounded-md p-2"
              />
              <button
                type="submit"
                className="bg-purple-600 text-white rounded-md px-4"
              >
                Submit
              </button>
            </form>
          ) : (
            <>
              <p className="text-md font-medium text-gray-700">
                Available Balance ={" "}
                <span className="font-semibold text-green-600 text-xl">
                  ₹{availableBalance.toLocaleString("en-IN")}
                </span>
              </p>

              <button
                onClick={handleEditBalance}
                className="bg-gray-200 text-gray-700 rounded-md px-4 py-1"
              >
                Edit
              </button>
            </>
          )}

        </div>
      </div>


      {/* Add an expense form */}
      <div className='w-full flex items-center justify-center mt-4'>
        <form
          className='w-full flex flex-col rounded-md border border-dashed border-black/10 bg-white p-2'
          onSubmit={(e) => handleSubmit(e)}>
          <h1 className='mb-4 text-center text-xl font-semibold tracking-tighter p-2'>Add an Expense</h1>
          <textarea
            name="description"
            placeholder='Enter the description'
            className='outline-none resize-none border border-black/10 rounded-md mb-4 p-2'></textarea>
          <select
            name="category"
            className='border border-black/10 rounded-md outline-none mb-4 p-2'
          >
            {categories.map((category) => (
              (
                <option
                  key={category}
                  value={`${category}`}
                  className='rounded-md p-2'
                >
                  {category}
                </option>
              )
            ))}
          </select>
          <textarea
            name="value"
            placeholder="Enter multiple amounts separated by space (e.g. 100 250 75)"
            className="outline-none resize-none border border-black/10 rounded-md mb-2 p-2"
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
            className='w-full bg-purple-600 text-white rounded-md p-2'
          >
            {loading ? <span>Loading....</span> : <span>Add Expense</span>}
          </button>
        </form>
      </div>

      {/* Monthly Expense Insights */}
      <div className="bg-white w-full border border-dashed border-black/10 rounded-md mt-4 mb-4">
        <p className="mb-4 text-center text-xl font-semibold tracking-tighter p-2">Monthly Payment Insights</p>
        {Object.keys(categoryTotals).length === 0 ? (
          <p className="text-center text-gray-500 pb-4">
            No expenses for this month
          </p>
        ) : (
          <div className="px-4 pb-4">
            {Object.entries(categoryTotals).map(([category, amount]) => (
              <div
                key={category}
                className="flex justify-between border-b border-black/5 py-2"
              >
                <span className="text-gray-600">{category}</span>
                <span className="font-semibold">
                  ₹{amount.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
