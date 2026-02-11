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
  }),
});

export const { useLoginMutation, useSignupMutation } = userApi;
