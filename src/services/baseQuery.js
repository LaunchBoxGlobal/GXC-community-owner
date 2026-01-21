import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { BASE_URL } from "../data/baseUrl";
import { enqueueSnackbar } from "notistack";
import { handleLogout } from "../utils/handleLogout";

let isErrorToastActive = false;

const showSingleToast = (message, options = {}) => {
  if (isErrorToastActive) return;

  isErrorToastActive = true;
  enqueueSnackbar(message, options);

  setTimeout(() => {
    isErrorToastActive = false;
  }, 2000);
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = Cookies.get("ownerToken");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error) {
    const status = result.error?.status;

    switch (status) {
      case 401:
        showSingleToast(
          result?.error?.data?.message ||
            "Session expired. Please log in again.",
          {
            variant: "error",
          }
        );
        handleLogout();
        if (typeof window !== "undefined") {
          window.location.replace("/login");
        }
        break;

      case 400:
        showSingleToast(
          result?.error?.data?.message || "Something went wrong.",
          { variant: "error" }
        );
        break;

      case 403:
        showSingleToast(
          result?.error?.data?.message || "You do not have permission.",
          { variant: "error" }
        );
        handleLogout();
        break;

      case 404:
        showSingleToast(result?.error?.data?.message || "Resource not found.", {
          variant: "error",
        });
        break;

      case 500:
        showSingleToast("Server error occurred.", { variant: "error" });
        break;

      default:
        showSingleToast("Something went wrong!", { variant: "error" });
        break;
    }
  }

  return result;
};
