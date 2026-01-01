import { NextResponse } from "next/server";
import dbConnect from "@/libs/dbConnect";
import ExpenseModel from "@/models/expenseSchema";

export async function GET() {
    try {
        await dbConnect();

        const now = new Date();

        // Start of today (00:00:00)
        const startOfDay = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        // Start of tomorrow (00:00:00)
        const startOfTomorrow = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1
        );

        const result = await ExpenseModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfDay,
                        $lt: startOfTomorrow,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: {
                            $convert: {
                                input: "$value",
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
        console.error("Error calculating today's expense", error);
        return NextResponse.json(
            { success: false, message: "Failed to calculate today's expense" },
            { status: 500 }
        );
    }
}
