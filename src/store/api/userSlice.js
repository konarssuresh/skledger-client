import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const userApi = createApi({
  reducerPath: "api/user",
  // use the shared baseQuery exported from ./baseQuery
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "api/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: "api/auth/signup",
        method: "POST",
        body: data,
      }),
    }),
    me: builder.query({
      query: () => ({
        url: "api/auth/me",
        method: "GET",
      }),
      extraOptions: {
        maxRetries: 0, // Disable retries for this query
      },
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useMeQuery } = userApi;
