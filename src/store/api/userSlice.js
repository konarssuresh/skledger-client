import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const userApi = createApi({
  reducerPath: "api/user",
  // use the shared baseQuery exported from ./baseQuery
  baseQuery,
  tagTypes: ["user"],
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
    loginWithGoogle: builder.mutation({
      query: (data) => ({
        url: "api/auth/login/google",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    me: builder.query({
      query: () => ({
        url: "api/auth/me",
        method: "GET",
      }),
      providesTags: ["user"],
      extraOptions: {
        maxRetries: 0, // Disable retries for this query
      },
    }),
    changePreferences: builder.mutation({
      query: (data) => ({
        url: "api/auth/changePreferences",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    signout: builder.mutation({
      query: () => ({
        url: "api/auth/signout",
        method: "POST",
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLoginWithGoogleMutation,
  useMeQuery,
  useChangePreferencesMutation,
  useSignoutMutation,
} = userApi;
