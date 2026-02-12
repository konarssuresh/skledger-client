import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const categoryApi = createApi({
  reducerPath: "api/categories",
  baseQuery,
  endpoints: (builder) => ({
    fetchCategories: builder.query({
      query: () => ({ url: "api/categories", method: "GET" }),
    }),
  }),
});

export const { useFetchCategoriesQuery } = categoryApi;

export default categoryApi.reducer;
