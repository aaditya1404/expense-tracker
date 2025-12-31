import dbConnect from "@/libs/dbConnect";
import ExpenseModel from "@/models/expenseSchema";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const { id } = await params;

        const deletedExpense = await ExpenseModel.findByIdAndDelete(id);

        if (!deletedExpense) {
            return NextResponse.json(
                { success: false, message: "Expense not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Expense deleted successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting expense:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete expense" },
            { status: 500 }
        );
    }
}
