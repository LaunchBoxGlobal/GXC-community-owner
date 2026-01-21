import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const transactionHistoryApi = createApi({
  reducerPath: "transactionHistoryApi",
  baseQuery,
  tagTypes: ["Transactions"],
  endpoints: (builder) => ({
    // Get transaction history (pagination + search)
    getTransactionHistory: builder.query({
      query: ({ page, limit, search }) => ({
        url: "/user/transactions",
        params: {
          page,
          limit,
          ...(search && { search }),
        },
      }),
      providesTags: ["Transactions"],
    }),

    // Get user revenue
    getRevenue: builder.query({
      query: () => ({
        url: "/user/financial-summary",
      }),
      providesTags: ["Transactions"],
    }),
  }),
});

export const { useGetTransactionHistoryQuery, useGetRevenueQuery } =
  transactionHistoryApi;
