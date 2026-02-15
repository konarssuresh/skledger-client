import { useMemo } from "react";
import { useSelector } from "react-redux";
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

const DayTransactions = () => {
  const selectedDay = useSelector(selectedDayKeySelector);

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

  const displayDate = useMemo(() => {
    if (!selectedDay) return "";
    const date = new Date(`${selectedDay}T00:00:00`);
    if (Number.isNaN(date.getTime())) return selectedDay;
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, [selectedDay]);

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

  const isLoading = isLoadingCategories || isLoadingTransactions;

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
                <div
                  key={transaction._id}
                  className="flex items-center justify-between rounded-xl border border-base-300 bg-base-100 px-3 py-2"
                >
                  <div>
                    <div className="text-sm font-semibold text-base-content">
                      {transaction.name}
                    </div>
                    <div className="text-xs text-base-content/60">
                      {category?.emoji ? `${category.emoji} ` : ""}
                      {category?.name || "Unknown category"} · {transaction.type}
                    </div>
                  </div>
                  <div className={`text-sm font-semibold ${amountClass}`}>
                    {sign} {formatAmount(transaction.amount, transaction.currency)}
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default DayTransactions;
