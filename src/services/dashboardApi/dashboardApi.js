import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery,
  endpoints: (builder) => ({
    // get dashboard stats
    getDashboardStats: builder.query({
      query: () => "/stats/community-owner/dashboard",
    }),

    // Check logged in user stripe status
    checkStripeStatus: builder.query({
      query: () => "/seller/stripe/return",
    }),
  }),
});

export const { useGetDashboardStatsQuery, useCheckStripeStatusQuery } =
  dashboardApi;
