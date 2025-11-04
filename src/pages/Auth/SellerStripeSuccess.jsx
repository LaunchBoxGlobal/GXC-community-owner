import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { enqueueSnackbar } from "notistack";
import Loader from "../../components/Loader/Loader";
import { useAppContext } from "../../context/AppContext";

const SellerStripeSuccess = () => {
  const navigate = useNavigate();

  const { handleCheckStripeAccountStatus } = useAppContext();

  useEffect(() => {
    handleCheckStripeAccountStatus();
  }, []);

  return (
    <div className="w-full h-screen bg-white">
      <div className="w-full h-screen flex flex-col gap-3 items-center justify-center fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)]">
        <Loader />
        <h2 className="text-[24px] font-semibold">Verifying</h2>
      </div>
    </div>
  );
};

export default SellerStripeSuccess;
