import { NextResponse } from "next/server";
import Balance from "@/models/balanceSchema";
import dbConnect from "@/libs/dbConnect";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { amount } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ success: false });
        }

        let balance = await Balance.findOne();

        if (balance) {
            balance.amount = amount;
            await balance.save();
        } else {
            balance = await Balance.create({ amount });
        }

        return NextResponse.json({
            success: true,
            amount: balance.amount,
        });
    } catch (err) {
        return NextResponse.json({ success: false });
    }
}
