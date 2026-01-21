import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    // get notifications list
    getNotifications: builder.query({
      query: ({ page, limit }) => ({
        url: "/user/get-notifications",
        params: { page, limit },
      }),
    }),
  }),
});

export const { useGetNotificationsQuery } = notificationsApi;
