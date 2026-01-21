import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery,
  endpoints: (builder) => ({
    // complete profile mutation
    completeUserProfile: builder.mutation({
      query: (data) => ({
        url: `/auth/profile`,
        method: "PUT",
        body: data,
      }),
    }),

    // upload profile picture
    uploadProfilePicture: builder.mutation({
      query: (formData) => ({
        url: `/auth/upload-profile-picture`,
        method: "POST",
        body: formData,
      }),
    }),

    // Check logged in user stripe status
    checkStripeStatus: builder.query({
      query: () => "/seller/stripe/return",
    }),

    // Create logged in user stripe account
    createStripeAccount: builder.mutation({
      query: () => ({
        url: "/seller/stripe/onboarding",
        method: "POST",
      }),
    }),

    getMyProfile: builder.query({
      query: () => "/auth/profile",
    }),

    toggleNotificationSettings: builder.mutation({
      query: (settings) => ({
        url: `/auth/profile`,
        method: "PUT",
        body: settings,
      }),
    }),

    settingsChangePassword: builder.mutation({
      query: (data) => ({
        url: `/auth/change-password`,
        method: "POST",
        body: data,
      }),
    }),

    requestDeleteAccountOtp: builder.mutation({
      query: (data) => ({
        url: `/auth/request-delete-account`,
        method: "POST",
        body: data,
      }),
    }),

    deleteAccount: builder.mutation({
      query: (data) => ({
        url: `/auth/delete`,
        method: "POST",
        body: data,
      }),
    }),

    // ban / unban user
    banUser: builder.mutation({
      query: ({ communityId, userId, action }) => ({
        url: `/communities/${communityId}/members/${userId}/${action}`,
        method: "POST",
        body: {},
      }),
    }),

    getMember: builder.query({
      query: ({ communityId, userId }) => ({
        url: `/communities/${communityId}/members/${userId}/details`,
      }),
    }),

    getMemberPublicProfile: builder.query({
      query: ({ userId }) => ({
        url: `/users/${userId}/profile`,
      }),
    }),
  }),
});

export const {
  useCompleteUserProfileMutation,
  useUploadProfilePictureMutation,
  useLazyCheckStripeStatusQuery,
  useCheckStripeStatusQuery,
  useCreateStripeAccountMutation,
  useGetMyProfileQuery,
  useToggleNotificationSettingsMutation,
  useSettingsChangePasswordMutation,
  useRequestDeleteAccountOtpMutation,
  useDeleteAccountMutation,
  useBanUserMutation,
  useGetMemberQuery,
  useGetMemberPublicProfileQuery,
} = userApi;
