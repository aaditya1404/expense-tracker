import { NextResponse } from "next/server";
import dbConnect from "@/libs/dbConnect";
import ExpenseModel from "@/models/expenseSchema";

export async function GET() {
    try {
        await dbConnect();

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfNextMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1
        );

        const result = await ExpenseModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfMonth,
                        $lt: startOfNextMonth,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: {
                            $convert: {
                                input: "$value",   // string value
                                to: "double",
                                onError: 0,
                                onNull: 0,
                            },
                        },
                    },
                },
            },
        ]);

        return NextResponse.json(
            {
                success: true,
                total: result[0]?.total || 0,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error calculating monthly expense", error);
        return NextResponse.json(
            { success: false, message: "Failed to calculate expense" },
            { status: 500 }
        );
    }
}
