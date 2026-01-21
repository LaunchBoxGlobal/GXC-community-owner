import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const reportsApi = createApi({
  reducerPath: "reportsApi",
  baseQuery: baseQuery,
  tagTypes: ["Reports"],
  endpoints: (builder) => ({
    getReports: builder.query({
      query: ({ page, limit, search }) => ({
        url: "/reports/communities/user-reports",
        params: {
          page,
          limit,
          ...(search && { search }),
        },
      }),
      providesTags: ["Reports"],
    }),

    submitBugReport: builder.mutation({
      query: (reportData) => ({
        url: "/reports/bugs",
        method: "POST",
        body: reportData,
      }),
    }),
  }),
});

export const { useGetReportsQuery, useSubmitBugReportMutation } = reportsApi;
