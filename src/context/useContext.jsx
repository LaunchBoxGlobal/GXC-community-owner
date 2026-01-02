import axios from "axios";
import { createContext, useContext, useState } from "react";
import { BASE_URL } from "../data/baseUrl";
import { getToken } from "../utils/getToken";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "../utils/handleApiError";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isStripeAccountCreated, setIStripeAccountCreated] = useState(false);
  const [
    showStripeAccountConfirmationModal,
    setShowStripeAccountConfirmationModal,
  ] = useState(false);

  const handleCheckStripeAccountStatus = async () => {
    setIStripeAccountCreated(true);
    try {
      const res = await axios.get(`${BASE_URL}/seller/stripe/return`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (res?.data?.success) {
        navigate("/");
      } else {
        setShowStripeAccountConfirmationModal(true);
      }
    } catch (error) {
      if (error?.status === 404) {
        setShowStripeAccountConfirmationModal(true);
        return;
      }
      // console.log("handleCheckStripeAccountStatus error >>> ", error);
      handleApiError(error, navigate);
    } finally {
      setIStripeAccountCreated(false);
    }
  };

  const handleCreateStripeAccount = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/seller/stripe/onboarding`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (res?.data?.success && res?.data?.data?.url) {
        window.open(res.data.data.url, "_blank", "noopener,noreferrer");
        setShowStripeAccountConfirmationModal(false);
      }
    } catch (error) {
      console.error("create stripe account error >>> ", error);
      handleApiError(error, navigate);
    } finally {
      setCreateStripe(false);
      setShowStripeAccountConfirmationModal(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        isStripeAccountCreated,
        setIStripeAccountCreated,
        showStripeAccountConfirmationModal,
        setShowStripeAccountConfirmationModal,
        handleCheckStripeAccountStatus,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
