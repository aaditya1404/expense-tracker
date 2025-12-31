import mongoose, { Schema } from "mongoose";

export interface Expense {
    description: string,
    category: string,
    value: string
}

const expenseSchema: Schema<Expense> = new Schema({
    description: String,
    category: String,
    value: String,
}, { timestamps: true });

const ExpenseModel = (mongoose.models.Expense as mongoose.Model<Expense>) || (mongoose.model<Expense>("Expense", expenseSchema));

export default ExpenseModel;