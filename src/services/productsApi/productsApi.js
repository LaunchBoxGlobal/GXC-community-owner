import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getProductById: builder.query({
      query: (productId) => ({
        url: `/products/${productId}`,
      }),
    }),
  }),
});

export const { useGetProductByIdQuery } = productsApi;
