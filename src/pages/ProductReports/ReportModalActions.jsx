import { useState } from "react";
import Loader from "../../components/Loader/Loader";
import { enqueueSnackbar } from "notistack";
import { useUpdateReportStatusMutation } from "../../services/reportedProductsApi/reportedProductsApi";
import { useTranslation } from "react-i18next";

const ReportModalActions = ({ report, refetch }) => {
  const [isPending, setIsPending] = useState(false);
  const [actionType, setActionType] = useState(null);
  const { t } = useTranslation("reportedProducts");

  const [updateReportStatus] = useUpdateReportStatusMutation();

  const markReportResolvedRejected = async (status) => {
    setActionType(status);
    setIsPending(true);

    try {
      const res = await updateReportStatus({
        id: report?.id,
        status,
      }).unwrap();

      enqueueSnackbar(res?.message || t("Report updated successfully."), {
        variant: "success",
      });

      // Keeping this EXACTLY as you requested
      refetch();
    } catch (error) {
      enqueueSnackbar(error?.data?.message || t("Something went wrong."), {
        variant: "error",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full">
      {report?.status === "pending" && (
        <div className="w-full mt-3 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="w-full bg-gray-200 text-black h-[49px] rounded-[8px] text-sm lg:text-base text-center font-medium disabled:cursor-not-allowed"
            onClick={() => markReportResolvedRejected("rejected")}
          >
            {isPending && actionType === "rejected" ? (
              <Loader />
            ) : (
              t("Mark As Rejected")
            )}
          </button>

          <button
            type="button"
            className="button"
            onClick={() => markReportResolvedRejected("resolved")}
          >
            {isPending && actionType === "resolved" ? (
              <Loader />
            ) : (
              t("Mark As Resolved")
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportModalActions;
