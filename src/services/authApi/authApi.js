import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    // sign up user mutation
    signup: builder.mutation({
      query: (formData) => ({
        url: "/auth/register",
        method: "POST",
        body: formData,
      }),
    }),

    // Login user mutation
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    // verify email to get OTP mutation
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
    }),

    // veriy OTP mutation
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-reset-code",
        method: "POST",
        body: data,
      }),
    }),

    // verify forgot password email
    verifyForgotPasswordEmail: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    // resend OTP mutation
    resendOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/resend-verification",
        method: "POST",
        body: data,
      }),
    }),

    // reset password mutation
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    // logout user mutation
    logoutUser: builder.mutation({
      query: (data) => ({
        url: "/auth/logout",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useVerifyEmailMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useVerifyForgotPasswordEmailMutation,
  useResetPasswordMutation,
  useLogoutUserMutation,
} = authApi;
