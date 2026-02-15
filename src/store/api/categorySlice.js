import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const categoryApi = createApi({
  reducerPath: "api/categories",
  baseQuery,
  tagTypes: ["Categories"],
  endpoints: (builder) => ({
    fetchCategories: builder.query({
      query: () => ({ url: "api/categories", method: "GET" }),
      providesTags: () => [{ type: "Categories", id: "LIST" }],
    }),
    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: "api/categories/create",
        method: "POST",
        body: categoryData,
      }),
      invalidatesTags: () => [{ type: "Categories", id: "LIST" }],
    }),
  }),
});

export const { useFetchCategoriesQuery, useCreateCategoryMutation } = categoryApi;

export default categoryApi.reducer;
