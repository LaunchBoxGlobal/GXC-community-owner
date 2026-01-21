import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const reportedProductsApi = createApi({
  reducerPath: "reportedProductsApi",
  baseQuery,
  tagTypes: ["ReportedProducts"],
  endpoints: (builder) => ({
    // get reported products (pagination + search)
    getReportedProducts: builder.query({
      query: ({ page, limit, search }) => ({
        url: `/products/reports/list`,
        params: {
          page,
          limit,
          ...(search && { search }),
        },
      }),
      providesTags: ["ReportedProducts"],
    }),

    // get report by id
    getReportById: builder.query({
      query: (id) => `/products/reports/${id}`,
      providesTags: (r, e, id) => [{ type: "ReportedProducts", id }],
    }),

    // ban / unban seller
    toggleSellerStatus: builder.mutation({
      query: ({ communityId, sellerId, action }) => ({
        url: `/communities/${communityId}/members/${sellerId}/${action}`,
        method: "POST",
        body: { reason: "" },
      }),
      invalidatesTags: (result, error, { sellerId }) => [
        { type: "ReportedProducts", id: sellerId },
      ],
    }),

    // remove seller from community
    removeSellerFromCommunity: builder.mutation({
      query: ({ communityId, sellerId }) => ({
        url: `/communities/${communityId}/members/${sellerId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { sellerId }) => [
        { type: "ReportedProducts", id: sellerId },
      ],
    }),

    // mark report as resolved / rejected
    updateReportStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: "/products/reports/status",
        method: "POST",
        body: { id, status },
      }),
      invalidatesTags: ["ReportedProducts"],
    }),

    // delist product
    delistProduct: builder.mutation({
      query: (productId) => ({
        url: `/products/${productId}/delist`,
        method: "POST",
      }),
      invalidatesTags: ["ReportedProducts"],
    }),
  }),
});

export const {
  useGetReportedProductsQuery,
  useGetReportByIdQuery,
  useLazyGetReportByIdQuery,
  useToggleSellerStatusMutation,
  useRemoveSellerFromCommunityMutation,
  useUpdateReportStatusMutation,
  useDelistProductMutation,
} = reportedProductsApi;
