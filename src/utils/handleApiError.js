// import Cookies from "js-cookie";
// import { enqueueSnackbar } from "notistack";

// export const handleApiError = (error, navigate) => {
//   if (error?.response) {
//     const status = error.response.status;

//     if (status === 401) {
//       console.warn("Unauthorized: Invalid or expired token.");
//       enqueueSnackbar("Your session has expired. Please log in again.", {
//         variant: "error",
//       });
//       localStorage.removeItem("ownerToken");
//       Cookies.remove("ownerToken");
//       Cookies.remove("owner");
//       Cookies.remove("page");
//       Cookies.remove("isOwnerEmailVerified");
//       Cookies.remove("slug");
//       navigate("/login");
//       return;
//     } else if (status === 403) {
//       console.warn("Forbidden: You don’t have access.");
//       enqueueSnackbar(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Access denied, please contact support",
//         {
//           variant: "error",
//         }
//       );
//     } else if (status >= 500) {
//       console.error("Server error:", error?.response?.data?.message);
//       enqueueSnackbar(
//         "Something went wrong on our end. Please try again later.",
//         {
//           variant: "error",
//         }
//       );
//     } else {
//       console.error("API error:", error.response.data?.message);
//       enqueueSnackbar(
//         error.response.data?.message || error?.message || "An error occurred.",
//         {
//           variant: "error",
//         }
//       );
//     }
//   } else if (error?.request) {
//     console.error("No response from server:", error.request);
//     enqueueSnackbar(
//       "Unable to connect to the server. Please check your internet.",
//       {
//         variant: "error",
//       }
//     );
//   } else {
//     console.error("Error:", error.message);
//     enqueueSnackbar("Unexpected error occurred. Please try again.", {
//       variant: "error",
//     });
//   }
// };

import Cookies from "js-cookie";
import { enqueueSnackbar } from "notistack";
import {
  shouldShowError,
  markErrorShown,
  isLoggingOut,
  startLogout,
} from "./apiErrorManager";

export const handleApiError = (error, navigate) => {
  if (error?.response) {
    const status = error.response.status;

    // ----------------- 400 -----------------
    if (status === 400) {
      // if (shouldShowError("errOther")) {
      // markErrorShown("errOther");

      enqueueSnackbar(
        error?.response?.data?.message ||
          error?.message ||
          "Invalid request. Please check your input.",
        { variant: "error" }
      );
      // }
      return;
    }

    // ----------------- 401 -----------------
    if (status === 401) {
      // If logout already triggered, ignore all further 401s
      if (isLoggingOut) return;

      if (shouldShowError("err401")) {
        markErrorShown("err401");
      }

      // Mark logout started
      startLogout();

      console.warn("Unauthorized: Invalid or expired token.");

      enqueueSnackbar(
        error?.response?.data?.message ||
          error?.message ||
          "Your session has expired. Please log in again.",
        {
          variant: "error",
        }
      );

      // Clear cookies and storage
      localStorage.removeItem("ownerToken");
      Cookies.remove("ownerToken");
      Cookies.remove("owner");
      Cookies.remove("page");
      Cookies.remove("isOwnerEmailVerified");
      Cookies.remove("slug");

      // Force logout navigation
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 50);

      return;
    }

    // ----------------- 403 -----------------
    if (status === 403) {
      if (shouldShowError("err403")) {
        markErrorShown("err403");
        enqueueSnackbar(
          error?.response?.data?.message ||
            error?.message ||
            "Access denied, please contact support",
          { variant: "error" }
        );
      }
      return;
    }

    // ----------------- 500+ -----------------
    if (status >= 500) {
      // if (shouldShowError("err500")) {
      markErrorShown("err500");
      enqueueSnackbar(
        "Something went wrong on our end. Please try again later.",
        {
          variant: "error",
        }
      );
      // }
      return;
    }

    // ----------------- OTHER API ERRORS -----------------
    if (shouldShowError("errOther")) {
      markErrorShown("errOther");
      enqueueSnackbar(
        error.response.data?.message || error?.message || "An error occurred.",
        { variant: "error" }
      );
    }

    return;
  }

  // ----------------- NO SERVER RESPONSE -----------------
  if (error?.request) {
    if (shouldShowError("errNetwork")) {
      markErrorShown("errNetwork");
      enqueueSnackbar(
        "Unable to connect to the server. Please check your internet.",
        { variant: "error" }
      );
    }
    return;
  }

  // ----------------- UNKNOWN ERRORS -----------------
  if (shouldShowError("errUnknown")) {
    markErrorShown("errUnknown");
    enqueueSnackbar("Unexpected error occurred. Please try again.", {
      variant: "error",
    });
  }
};
