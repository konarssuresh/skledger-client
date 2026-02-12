import { FormButton } from "../../common-components";
import { showDialog } from "../../common-components/DialogContainer.jsx";
import AddTransactionDialog from "./AddTransactionDialog.jsx";

const TransactionsPage = () => {
  const handleOpenAddTransaction = () => {
    const closeDialog = showDialog(
      <AddTransactionDialog
        onClose={() => {
          closeDialog();
        }}
      />,
    );
  };

  return (
    <main className="min-h-screen p-6 md:p-10">
      <section className="mx-auto w-full max-w-6xl rounded-3xl border border-slate-200/70 bg-base-100 p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Transactions
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track and manage income, expense, and savings entries.
            </p>
          </div>
          <FormButton
            type="button"
            fullWidth={false}
            className="min-w-44"
            onClick={handleOpenAddTransaction}
          >
            Add transaction
          </FormButton>
        </div>
      </section>
    </main>
  );
};

export default TransactionsPage;
