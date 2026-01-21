import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import Loader from "../../components/Loader/Loader";
import { useCheckStripeStatusQuery } from "../../services/userApi/userApi";

const SellerStripeSuccess = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useCheckStripeStatusQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );

  useEffect(() => {
    if (!data) return;

    if (data?.success) {
      navigate("/", { replace: true });
    } else {
      enqueueSnackbar("Account could not be created!", {
        variant: "error",
      });
      navigate("/", { replace: true });
    }
  }, [data, navigate]);

  useEffect(() => {
    if (isError) {
      enqueueSnackbar(error?.data?.message || "Something went wrong", {
        variant: "error",
      });
      navigate("/", { replace: true });
    }
  }, [isError, error, navigate]);

  return (
    <div className="w-full h-screen bg-transparent fixed inset-0 z-50">
      {isLoading && (
        <div className="w-full h-screen flex flex-col gap-3 items-center justify-center fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)]">
          <Loader />
          <h2 className="text-[24px] font-semibold">Verifying</h2>
        </div>
      )}
    </div>
  );
};

export default SellerStripeSuccess;
