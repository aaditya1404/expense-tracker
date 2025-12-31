import AddExpenseForm from "@/components/AddExpenseForm";
import TotalExpense from "@/components/TotalExpense";

export default function Home() {
  return (
    <div>
      <TotalExpense />
      <AddExpenseForm />
    </div>
  );
}
