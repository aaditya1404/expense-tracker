import dbConnect from "@/libs/dbConnect";
import ExpenseModel from "@/models/expenseSchema";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        await dbConnect();
        const response = await ExpenseModel.find().sort({ createdAt: -1 });
        return NextResponse.json(
            {message: "Expense fetched successfully", success: true, response},
            {status: 200}
        )
    } catch (error) {
        console.log("Error getting all expenses", error);
        return NextResponse.json(
            {message: "Error fetching", success: false},
            {status: 500}
        )
    }
}