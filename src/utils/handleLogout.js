import Cookies from "js-cookie";

export const handleLogout = () => {
  Cookies.remove("ownerToken");
  Cookies.remove("owner");
  Cookies.remove("ownerEmail");
  Cookies.remove("slug");
  Cookies.remove("isOwnerEmailVerified");
  Cookies.remove("page");
  Cookies.remove("ownerBrowserDeviceId");
  Cookies.remove("ownerfcmToken");
  localStorage.removeItem("ownerfcmToken");
  localStorage.removeItem("ownerBrowserDeviceId");
};
