import { createApi } from "@reduxjs/toolkit/query/react";

import baseQuery from "./baseQuery";

export const transactionApi = createApi({
  reducerPath: "api/transactions",
  baseQuery,
  endpoints: (builder) => ({
    fetchTransactions: builder.query({
      query: () => ({ url: "api/transactions", method: "GET" }),
    }),
    addTransaction: builder.mutation({
      query: (transactionData) => ({
        url: "api/transactions/create",
        method: "POST",
        body: transactionData,
      }),
    }),
  }),
});

export const { useFetchTransactionsQuery, useAddTransactionMutation } =
  transactionApi;

export default transactionApi.reducer;
