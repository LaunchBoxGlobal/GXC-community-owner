import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [user, setUser] = useState(null);
  const [showEmailVerificationPopup, setShowEmailVerificationPopup] =
    useState(false);
  const [showCommunityLinkPopup, setShowCommunityLinkPopup] = useState(false);
  const [token, setToken] = useState(Cookies.get("ownerToken") || null);

  const handleShowPaymentModal = () => {
    setShowPaymentModal((prev) => !prev);
  };

  useEffect(() => {
    const tokenCookie = Cookies.get("ownerToken");
    const userCookie = Cookies.get("owner");
    if (tokenCookie) setToken(tokenCookie);
    if (userCookie) setUser(JSON.parse(userCookie));
  }, []);

  // Keep cookies and state in sync
  const updateUser = (newUser) => {
    if (newUser) {
      Cookies.set("owner", JSON.stringify(newUser));
      setUser(newUser);
    } else {
      Cookies.remove("owner");
      setUser(null);
    }
  };

  const updateToken = (newToken) => {
    if (newToken) {
      Cookies.set("ownerToken", newToken);
      setToken(newToken);
    } else {
      Cookies.remove("ownerToken");
      setToken(null);
    }
  };
  const handleShowSuccessModal = () => {
    setShowPaymentModal(false);
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowPaymentModal(false);
    setShowSuccessModal(false);
  };
  return (
    <AppContext.Provider
      value={{
        showPaymentModal,
        handleShowPaymentModal,
        handleShowSuccessModal,
        handleCloseSuccessModal,
        showSuccessModal,
        user,
        setUser,
        token,
        setToken,
        showEmailVerificationPopup,
        setShowEmailVerificationPopup,
        showCommunityLinkPopup,
        setShowCommunityLinkPopup,
        updateUser,
        updateToken,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
