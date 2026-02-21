import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const analyticsApi = createApi({
  reducerPath: "api/analytics",
  baseQuery,
  tagTypes: ["Analytics"],
  endpoints: (builder) => ({
    fetchDashboardAnalytics: builder.query({
      query: ({ periodType = "monthly", date }) => {
        const params = new URLSearchParams();
        if (periodType) params.set("periodType", periodType);
        if (date) params.set("date", date);
        return {
          url: `api/analytics/dashboard?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Analytics"],
    }),
  }),
});

export const { useFetchDashboardAnalyticsQuery } = analyticsApi;
