import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// for local development add it in baseurl
// import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"

const baseQuery = fetchBaseQuery({
  baseUrl: "",
  credentials: "include",
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export default baseQuery;
