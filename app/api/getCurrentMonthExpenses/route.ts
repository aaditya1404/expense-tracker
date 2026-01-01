import { NextResponse } from "next/server";
import dbConnect from "@/libs/dbConnect";
import ExpenseModel from "@/models/expenseSchema";

export async function GET() {
    try {
        await dbConnect();

        const now = new Date();

        const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        const startOfNextMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1
        );

        const expenses = await ExpenseModel.find({
            createdAt: {
                $gte: startOfMonth,
                $lt: startOfNextMonth,
            },
        }).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            expenses,
        });
    } catch (error) {
        console.error("Error fetching monthly expenses", error);
        return NextResponse.json(
            { success: false },
            { status: 500 }
        );
    }
}
