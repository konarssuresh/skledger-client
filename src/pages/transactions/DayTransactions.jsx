import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { FormButton } from "../../common-components";
import { showDialog } from "../../common-components/DialogContainer.jsx";
import AddTransactionDialog from "./AddTransactionDialog.jsx";
import DeleteTransactionDialog from "./DeleteTransactionDialog.jsx";
import { useFetchCategoriesQuery } from "../../store/api/categorySlice";
import { useFetchTransactionsForDayQuery } from "../../store/api/transactionSlice";
import { Selectors } from "../../store/calendarSlice.js";

const { selectedDayKeySelector } = Selectors;

const amountClassByType = {
  income: "text-success",
  expense: "text-error",
  savings: "text-info",
};

const signByType = {
  income: "+",
  expense: "-",
  savings: "-",
};

const toTitleCase = (value = "") =>
  value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : "";

const formatAmount = (amount, currency = "INR") => {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));
  } catch {
    return `${currency} ${Number(amount || 0)}`;
  }
};

const formatDateLabel = (dateKey) => {
  if (!dateKey) return "";
  const date = new Date(`${dateKey}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateKey;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const TransactionActionSheet = ({
  transaction,
  category,
  displayDate,
  onClose,
  onEdit,
  onDelete,
}) => {
  const amountClass =
    amountClassByType[transaction?.type] || "text-base-content";
  const sign = signByType[transaction?.type] || "";

  return createPortal(
    <div
      className="fixed inset-0 z-[1100] flex items-end bg-slate-900/40"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full rounded-t-3xl border border-base-300 bg-base-100 px-4 pb-5 pt-4 shadow-2xl md:mx-auto md:mb-4 md:max-w-md md:rounded-2xl">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-base-300" />
        <div className="text-sm font-semibold text-base-content">
          {displayDate}
        </div>

        <div className="mt-3 rounded-xl border border-base-300 bg-base-100 p-3">
          <div className="text-base font-semibold text-base-content">
            {transaction.name}
          </div>
          <div className="text-sm text-base-content/65">
            {category?.emoji ? `${category.emoji} ` : ""}
            {category?.name || "Unknown category"} ·{" "}
            {toTitleCase(transaction.type)}
          </div>
          <div className={`mt-2 text-lg font-bold ${amountClass}`}>
            {sign} {formatAmount(transaction.amount, transaction.currency)}
          </div>
        </div>

        <div className="my-4 h-px bg-base-300" />

        <div className="grid gap-2">
          <FormButton type="button" variant="outline" onClick={onEdit}>
            Edit
          </FormButton>
          <FormButton
            type="button"
            className="border-red-200 bg-red-500 text-white hover:bg-red-600"
            onClick={onDelete}
          >
            Delete
          </FormButton>
        </div>
      </div>
    </div>,
    document.body,
  );
};

const DayTransactions = () => {
  const selectedDay = useSelector(selectedDayKeySelector);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const { data: { categories = [] } = {}, isLoading: isLoadingCategories } =
    useFetchCategoriesQuery(undefined, {
      refetchOnReconnect: true,
    });

  const { data: { transactions = [] } = {}, isLoading: isLoadingTransactions } =
    useFetchTransactionsForDayQuery({
      date: selectedDay,
    });

  const categoryMap = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category._id] = category;
      return acc;
    }, {});
  }, [categories]);

  const displayDate = useMemo(
    () => formatDateLabel(selectedDay),
    [selectedDay],
  );

  const isLoading = isLoadingCategories || isLoadingTransactions;

  const openEditDialog = (transaction) => {
    const closeDialog = showDialog(
      <AddTransactionDialog
        transaction={transaction}
        onClose={() => {
          closeDialog();
        }}
      />,
    );
  };

  const openDeleteConfirm = (transaction) => {
    let closeDialog = () => {};
    closeDialog = showDialog(
      <DeleteTransactionDialog
        transaction={transaction}
        onClose={() => closeDialog()}
        onDeleted={() => setSelectedTransaction(null)}
      />,
    );
  };

  return (
    <div className="mt-4 rounded-2xl border border-base-300 bg-base-100 p-2.5 md:mt-5 md:p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-base-content">
          {displayDate}
        </h2>
      </div>
      <div className="grid gap-2">
        {isLoading ? (
          <div className="rounded-xl border border-base-300 bg-base-200/40 px-3 py-4 text-sm text-base-content/60">
            Loading transactions...
          </div>
        ) : null}

        {!isLoading && transactions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-base-300 bg-base-200/40 px-3 py-4 text-sm text-base-content/60">
            No transactions for selected day.
          </div>
        ) : null}

        {!isLoading
          ? transactions.map((transaction) => {
              const category = categoryMap[transaction.categoryId];
              const amountClass =
                amountClassByType[transaction.type] || "text-base-content";
              const sign = signByType[transaction.type] || "";
              return (
                <button
                  key={transaction._id}
                  type="button"
                  onClick={() => setSelectedTransaction(transaction)}
                  className="flex items-center justify-between rounded-xl border border-base-300 bg-base-100 px-3 py-2 text-left transition hover:border-primary/40"
                >
                  <div>
                    <div className="text-sm font-semibold text-base-content">
                      {transaction.name}
                    </div>
                    <div className="text-xs text-base-content/60">
                      {category?.emoji ? `${category.emoji} ` : ""}
                      {category?.name || "Unknown category"} ·{" "}
                      {toTitleCase(transaction.type)}
                    </div>
                  </div>
                  <div className={`text-sm font-semibold ${amountClass}`}>
                    {sign}{" "}
                    {formatAmount(transaction.amount, transaction.currency)}
                  </div>
                </button>
              );
            })
          : null}
      </div>

      {selectedTransaction ? (
        <TransactionActionSheet
          transaction={selectedTransaction}
          category={categoryMap[selectedTransaction.categoryId]}
          displayDate={displayDate}
          onClose={() => setSelectedTransaction(null)}
          onEdit={() => {
            openEditDialog(selectedTransaction);
            setSelectedTransaction(null);
          }}
          onDelete={() => {
            setSelectedTransaction(null);
            openDeleteConfirm(selectedTransaction);
          }}
        />
      ) : null}
    </div>
  );
};

export default DayTransactions;
