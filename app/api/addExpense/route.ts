// import dbConnect from "@/libs/dbConnect";
// import ExpenseModel from "@/models/expenseSchema";
// import { NextResponse } from "next/server";
// // import BalanceModel from "@/models/balanceSchema";

// export async function POST(request: Request) {
//     const { description, category, value } = await request.json();
//     try {
//         await dbConnect();
//         const newExpense = await ExpenseModel.create({
//             description,
//             category,
//             value
//         });
//         return NextResponse.json(
//             { message: "New Expense created", success: true, newExpense },
//             { status: 200 }
//         )
//     } catch (error) {
//         console.log(error);
//         return NextResponse.json(
//             { message: "Unable to add an expense", success: false },
//             { status: 500 }
//         )
//     }
// }

import dbConnect from "@/libs/dbConnect";
import ExpenseModel from "@/models/expenseSchema";
import { NextResponse } from "next/server";
import BalanceModel from "@/models/balanceSchema";

export async function POST(request: Request) {
    const { description, category, value } = await request.json();
    const expenseAmount = Number(value);
    try {
        await dbConnect();
        const balance = await BalanceModel.findOne();

        if (!balance) {
            return NextResponse.json(
                { message: "Balance not set", success: false },
                { status: 400 }
            );
        }

        if (balance.amount < expenseAmount) {
            return NextResponse.json(
                { message: "Insufficient balance", success: false },
                { status: 400 }
            );
        }

        const newExpense = await ExpenseModel.create({
            description,
            category,
            value
        });
        balance.amount -= expenseAmount;
        await balance.save();
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