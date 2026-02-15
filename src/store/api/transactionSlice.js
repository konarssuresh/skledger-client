import { createApi } from "@reduxjs/toolkit/query/react";

import baseQuery from "./baseQuery";

const invalidateAfterAddOrUpdate = (result, error, transactionData) => {
  // Try to derive date/month from the provided transaction data first,
  // fall back to result (if backend returns created resource with date).
  const dateValue =
    (transactionData &&
      (transactionData.date || transactionData.transactionDate)) ||
    (result &&
      (result.date ||
        result.transactionDate ||
        result?.transaction?.date ||
        result?.transaction?.transactionDate));

  const invalidates = [{ type: "Transactions", id: "LIST" }];

  if (dateValue) {
    try {
      const d = new Date(dateValue);
      if (!Number.isNaN(d.getTime())) {
        invalidates.push({
          type: "TransactionsDay",
          id: formatDateKey(d),
        });
        invalidates.push({
          type: "MonthlySummary",
          id: formatMonthKey(d),
        });
      }
    } catch (e) {
      console.log("error while calculating tag", e);
      // ignore malformed date; still invalidate list
    }
  }

  return invalidates;
};

const formatMonthKey = (dateOrYear, maybeMonth) => {
  // Accept either (Date) or (year, month)
  if (dateOrYear instanceof Date) {
    const y = dateOrYear.getFullYear();
    const m = String(dateOrYear.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  }
  const year = Number(dateOrYear);
  const month = String(maybeMonth).padStart(2, "0");
  return `${year}-${month}`;
};

const formatDateKey = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

export const transactionApi = createApi({
  reducerPath: "api/transactions",
  baseQuery,
  tagTypes: ["Transactions", "TransactionsDay", "MonthlySummary"],
  endpoints: (builder) => ({
    fetchTransactions: builder.query({
      query: () => ({ url: "api/transactions", method: "GET" }),
      providesTags: () => [{ type: "Transactions", id: "LIST" }],
    }),
    fetchTransactionsForDay: builder.query({
      query: ({ date } = {}) => {
        return { url: `api/transactions?date=${date}` };
      },
      providesTags: (result, error, { date } = {}) => {
        // date is expected to be 'YYYY-MM-DD' or a Date-convertible value
        if (!date) return [];
        return [{ type: "TransactionsDay", id: String(date) }];
      },
    }),
    fetchMonthlyTransactionSummary: builder.query({
      query: ({ year, month } = {}) => {
        const params = new URLSearchParams();
        if (year) params.set("year", String(year));
        if (month) params.set("month", String(month).padStart(2, "0"));
        const queryString = params.toString();
        return {
          url: `api/transactions/month-summary${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (result, error, { year, month } = {}) => {
        if (!year || month == null) return [];
        return [{ type: "MonthlySummary", id: formatMonthKey(year, month) }];
      },
    }),
    addTransaction: builder.mutation({
      query: (transactionData) => ({
        url: "api/transactions/create",
        method: "POST",
        body: transactionData,
      }),
      invalidatesTags: invalidateAfterAddOrUpdate,
    }),
    updateTransaction: builder.mutation({
      query: ({ id, ...transactionData } = {}) => ({
        url: `api/transactions/${id}`,
        method: "PATCH",
        body: transactionData,
      }),
      invalidatesTags: invalidateAfterAddOrUpdate,
    }),
    deleteTransaction: builder.mutation({
      query: ({ id } = {}) => ({
        url: `api/transactions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { date } = {}) => {
        const invalidates = [{ type: "Transactions", id: "LIST" }];
        if (date) {
          const d = new Date(date);
          if (!Number.isNaN(d.getTime())) {
            invalidates.push({ type: "TransactionsDay", id: formatDateKey(d) });
            invalidates.push({ type: "MonthlySummary", id: formatMonthKey(d) });
          }
        }
        return invalidates;
      },
    }),
  }),
});

export const {
  useFetchTransactionsQuery,
  useFetchMonthlyTransactionSummaryQuery,
  useAddTransactionMutation,
  useFetchTransactionsForDayQuery,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionApi;

export default transactionApi.reducer;
