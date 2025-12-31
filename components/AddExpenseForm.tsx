"use client";
import React from 'react'

const AddExpenseForm = () => {

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        const payload = {
            description: formData.get("description"),
            category: formData.get("category"),
            value: formData.get("value"),
        }

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
    }

    return (
        <div>
            <form className='w-full flex flex-col' onSubmit={(e) => handleSubmit(e)}>
                <input type="text" placeholder='Enter the Expense Description' name='description' />
                <select name="category">
                    <option value="">Category</option>
                    <option value="Self Care">Self Care</option>
                    <option value="Travel">Travel</option>
                    <option value="Room">Room Rent</option>
                    <option value="Buying Techs">Buying Techs</option>
                    <option value="Food">Food</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Trips">Trips</option>
                    <option value="Parties">Parties</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                </select>
                <input type="text" placeholder='Enter the money spent' name='value' />
                <button type='submit'>Add Expense</button>
            </form>
        </div>
    )
}

export default AddExpenseForm;
