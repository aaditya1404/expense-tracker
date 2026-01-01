// import dbConnect from "@/libs/dbConnect";
// import ExpenseModel from "@/models/expenseSchema";
// import { NextResponse } from "next/server";

// export async function GET(){
//     try {
//         await dbConnect();
//         const response = await ExpenseModel.find().sort({ createdAt: -1 });
//         return NextResponse.json(
//             {message: "Expense fetched successfully", success: true, response},
//             {status: 200}
//         )
//     } catch (error) {
//         console.log("Error getting all expenses", error);
//         return NextResponse.json(
//             {message: "Error fetching", success: false},
//             {status: 500}
//         )
//     }
// }

  // useEffect(() => {
  //   const fetchExpenses = async () => {
  //     try {
  //       const response = await fetch("/api/getAllExpense", {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json"
  //         }
  //       });
  //       const data = await response.json();
  //       setExpenses(data.response);
  //     } catch (error) {
  //       console.log("Error fetching expenses", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchExpenses();
  // }, []);

import dbConnect from "@/libs/dbConnect";
import ExpenseModel from "@/models/expenseSchema";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const skip = (page - 1) * limit;

    const expenses = await ExpenseModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ExpenseModel.countDocuments();

    return NextResponse.json(
      {
        success: true,
        expenses,
        hasMore: skip + expenses.length < total,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error getting expenses", error);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}

