import { NextResponse } from "next/server";
import Balance from "@/models/balanceSchema";
import dbConnect from "@/libs/dbConnect";

export async function GET() {
  try {
    await dbConnect();

    const balance = await Balance.findOne();

    return NextResponse.json({
      success: true,
      amount: balance?.amount ?? 0,
    });
  } catch (err) {
    return NextResponse.json({ success: false });
  }
}
