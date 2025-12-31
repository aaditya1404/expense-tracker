import dbConnect from "@/libs/dbConnect";
import ExpenseModel from "@/models/expenseSchema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { description, category, value } = await request.json();
    try {
        await dbConnect();
        const newExpense = await ExpenseModel.create({
            description,
            category,
            value
        });
        return NextResponse.json(
            { message: "New Expense created", success: true, newExpense },
            { status: 200 }
        )
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Unable to add an expense", success: false },
            { status: 500 }
        )
    }
}