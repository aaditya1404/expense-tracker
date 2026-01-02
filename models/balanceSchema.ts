import mongoose from "mongoose";

const BalanceSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Balance ||
    mongoose.model("Balance", BalanceSchema);
